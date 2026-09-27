import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Team, Player, AuctionState } from '../types/auction';
import { DEFAULT_TEAMS, DEFAULT_PLAYERS, INITIAL_PURSE } from '../data/initialData';

const TEAMS_COL = 'teams';
const PLAYERS_COL = 'players';
const AUCTION_DOC = 'auction_state';

// Helper to remove any undefined values from objects before Firestore write
function sanitizeForFirestore<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeForFirestore(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// Purge any pre-saved mock/sample players from previous runs so only genuine user-added players appear
export async function purgeMockPlayers(): Promise<void> {
  try {
    const playersSnap = await getDocs(collection(db, PLAYERS_COL));
    const mockKeywords = ['priyam', 'rohit', 'bumrah', 'pandya', 'pant', 'kohli', 'sample', 'mock', 'demo'];
    for (const playerDoc of playersSnap.docs) {
      const data = playerDoc.data() as Partial<Player>;
      const id = playerDoc.id.toLowerCase();
      const name = (data.name || '').toLowerCase();
      const isMock = mockKeywords.some(kw => id.includes(kw) || name.includes(kw));
      if (isMock) {
        console.log(`Purging mock player: ${playerDoc.id} (${data.name})`);
        await deleteDoc(doc(db, PLAYERS_COL, playerDoc.id));
      }
    }
  } catch (err) {
    console.warn('Error purging mock players:', err);
  }
}

// Clear all players from the database (for clean slate requested by user)
export async function clearAllPlayers(): Promise<void> {
  try {
    const playersSnap = await getDocs(collection(db, PLAYERS_COL));
    for (const playerDoc of playersSnap.docs) {
      await deleteDoc(doc(db, PLAYERS_COL, playerDoc.id));
    }
    // Also reset active player in auction state
    const auctionStateDoc = doc(db, 'system', AUCTION_DOC);
    await updateDoc(auctionStateDoc, {
      activePlayerId: null,
      status: 'idle',
      currentBid: 2000,
      currentBidTeamId: null,
      currentBidTeamName: null,
      hammerCount: 0,
      history: []
    });
  } catch (err) {
    console.error('Error clearing all players:', err);
  }
}

// Initialize defaults in Firestore if empty
export async function initializeFirestoreDefaults(): Promise<void> {
  try {
    const teamsSnap = await getDocs(collection(db, TEAMS_COL));
    if (teamsSnap.empty) {
      console.log('Seeding initial DPL teams...');
      for (const team of DEFAULT_TEAMS) {
        const sanitizedTeam = sanitizeForFirestore({
          ...team,
          createdAt: Date.now()
        });
        await setDoc(doc(db, TEAMS_COL, team.id), sanitizedTeam);
      }
    }

    // Automatically purge any pre-saved mock players so player roster starts clean
    await purgeMockPlayers();

    // Set initial auction state if not present
    const auctionStateDoc = doc(db, 'system', AUCTION_DOC);
    await setDoc(auctionStateDoc, sanitizeForFirestore({
      currentRound: 1,
      activePlayerId: null,
      status: 'idle',
      currentBid: 2000,
      currentBidTeamId: null,
      currentBidTeamName: null,
      lastBidTime: Date.now(),
      hammerCount: 0,
      history: []
    }), { merge: true });
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
}

// Subscriptions
export function subscribeToTeams(callback: (teams: Team[]) => void) {
  const q = query(collection(db, TEAMS_COL), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const teams: Team[] = [];
    snapshot.forEach((d) => {
      teams.push({ id: d.id, ...d.data() } as Team);
    });
    callback(teams);
  }, (err) => {
    console.warn('Teams subscription error:', err);
  });
}

export function subscribeToPlayers(callback: (players: Player[]) => void) {
  const q = query(collection(db, PLAYERS_COL));
  return onSnapshot(q, (snapshot) => {
    const players: Player[] = [];
    snapshot.forEach((d) => {
      players.push({ id: d.id, ...d.data() } as Player);
    });
    // Sort by lotNumber or name
    players.sort((a, b) => (a.lotNumber || 99) - (b.lotNumber || 99));
    callback(players);
  }, (err) => {
    console.warn('Players subscription error:', err);
  });
}

export function subscribeToAuctionState(callback: (state: AuctionState) => void) {
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  return onSnapshot(auctionRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AuctionState);
    }
  }, (err) => {
    console.warn('Auction state subscription error:', err);
  });
}

// Team CRUD
export async function saveTeam(team: Team): Promise<void> {
  const teamRef = doc(db, TEAMS_COL, team.id);
  const sanitized = sanitizeForFirestore(team as unknown as Record<string, unknown>);
  await setDoc(teamRef, sanitized, { merge: true });
}

export async function deleteTeamDoc(teamId: string): Promise<void> {
  await deleteDoc(doc(db, TEAMS_COL, teamId));
}

export async function resetAllPurses(): Promise<void> {
  const teamsSnap = await getDocs(collection(db, TEAMS_COL));
  for (const t of teamsSnap.docs) {
    await updateDoc(doc(db, TEAMS_COL, t.id), {
      totalPurse: INITIAL_PURSE,
      remainingPurse: INITIAL_PURSE,
      spentPurse: 0,
      playersCount: 0
    });
  }
}

// Player CRUD
export async function savePlayer(player: Player): Promise<void> {
  const playerRef = doc(db, PLAYERS_COL, player.id);
  const dataToSave = {
    ...player,
    updatedAt: Date.now()
  };
  const sanitized = sanitizeForFirestore(dataToSave as unknown as Record<string, unknown>);
  await setDoc(playerRef, sanitized, { merge: true });
}

export async function deletePlayerDoc(playerId: string): Promise<void> {
  await deleteDoc(doc(db, PLAYERS_COL, playerId));
}

// Auction Actions
export async function setActivePlayer(playerId: string, basePrice: number): Promise<void> {
  // Mark player as live
  await updateDoc(doc(db, PLAYERS_COL, playerId), {
    status: 'live',
    currentBid: basePrice
  });

  // Update auction state
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  await updateDoc(auctionRef, {
    activePlayerId: playerId,
    status: 'bidding',
    currentBid: basePrice,
    currentBidTeamId: null,
    currentBidTeamName: null,
    lastBidTime: Date.now(),
    hammerCount: 0,
    history: []
  });
}

export async function placeBid(team: Team, newAmount: number, activePlayerId: string): Promise<void> {
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  const historyEntry = {
    id: 'bid_' + Date.now(),
    teamId: team.id,
    teamName: team.name,
    amount: newAmount,
    timestamp: Date.now()
  };

  // Update auction state
  await setDoc(auctionRef, {
    currentBid: newAmount,
    currentBidTeamId: team.id,
    currentBidTeamName: team.name,
    status: 'bidding',
    hammerCount: 0,
    lastBidTime: Date.now(),
    history: [historyEntry]
  }, { merge: true });

  // Update player currentBid
  await updateDoc(doc(db, PLAYERS_COL, activePlayerId), {
    currentBid: newAmount
  });
}

export async function updateHammerState(hammerCount: number): Promise<void> {
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  await updateDoc(auctionRef, {
    hammerCount,
    status: hammerCount >= 3 ? 'sold' : 'hammer_countdown'
  });
}

export async function sellPlayer(player: Player, team: Team, finalAmount: number): Promise<void> {
  // 1. Mark player as sold
  await updateDoc(doc(db, PLAYERS_COL, player.id), {
    status: 'sold',
    soldPrice: finalAmount,
    soldToTeamId: team.id,
    soldToTeamName: team.name
  });

  // 2. Deduct purse from team
  const newSpent = (team.spentPurse || 0) + finalAmount;
  const newRemaining = Math.max(0, (team.totalPurse || INITIAL_PURSE) - newSpent);
  const newCount = (team.playersCount || 0) + 1;

  await updateDoc(doc(db, TEAMS_COL, team.id), {
    spentPurse: newSpent,
    remainingPurse: newRemaining,
    playersCount: newCount
  });

  // 3. Update auction state to sold
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  await updateDoc(auctionRef, {
    status: 'sold',
    hammerCount: 3
  });
}

export async function markPlayerUnsold(player: Player): Promise<void> {
  await updateDoc(doc(db, PLAYERS_COL, player.id), {
    status: 'unsold',
    soldPrice: 0,
    soldToTeamId: null,
    soldToTeamName: null
  });

  const auctionRef = doc(db, 'system', AUCTION_DOC);
  await updateDoc(auctionRef, {
    status: 'unsold',
    hammerCount: 0
  });
}

export async function resetAuctionSession(): Promise<void> {
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  await setDoc(auctionRef, {
    currentRound: 1,
    activePlayerId: null,
    status: 'idle',
    currentBid: 0,
    currentBidTeamId: null,
    currentBidTeamName: null,
    lastBidTime: Date.now(),
    hammerCount: 0,
    history: []
  });
}
