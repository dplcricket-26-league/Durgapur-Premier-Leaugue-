import {
  collection,
  doc,
  getDoc,
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

// Recalculate all franchise purses from the true signed roster in Firestore
export async function recalculateAllTeamPurses(): Promise<void> {
  try {
    const [teamsSnap, playersSnap] = await Promise.all([
      getDocs(collection(db, TEAMS_COL)),
      getDocs(collection(db, PLAYERS_COL))
    ]);

    const soldPlayers = playersSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as Player))
      .filter(p => p.status === 'sold');

    for (const teamDoc of teamsSnap.docs) {
      const team = teamDoc.data() as Team;
      const teamRoster = soldPlayers.filter(
        p => p.soldToTeamId === teamDoc.id || 
             (p.soldToTeamName && p.soldToTeamName.toLowerCase() === team.name.toLowerCase()) ||
             (p.soldToTeamName && p.soldToTeamName.toLowerCase() === team.shortName?.toLowerCase())
      );

      const totalCap = team.totalPurse || INITIAL_PURSE;
      const spent = teamRoster.reduce((sum, p) => sum + (p.soldPrice || p.currentBid || 0), 0);
      const remaining = Math.max(0, totalCap - spent);

      await updateDoc(doc(db, TEAMS_COL, teamDoc.id), {
        spentPurse: spent,
        remainingPurse: remaining,
        playersCount: teamRoster.length
      });
    }
  } catch (err) {
    console.error('Error recalculating team purses:', err);
  }
}

// Refund a sold player: restores the franchise purse back to full ₹60,000 (or minus other signed players)
// and returns player back to available pool or live stage
export async function refundPlayer(
  player: Player,
  teams: Team[],
  reAuctionImmediately = false
): Promise<{ refundedAmount: number; teamName: string; remainingPurse: number }> {
  const refundAmount = player.soldPrice || player.currentBid || player.basePrice || 0;
  const buyerTeamId = player.soldToTeamId;
  const buyerTeamName = player.soldToTeamName;

  // 1. Reset player status back to available pool in Firestore first
  const newStatus = reAuctionImmediately ? 'live' : 'upcoming';
  await updateDoc(doc(db, PLAYERS_COL, player.id), {
    status: newStatus,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    currentBid: player.basePrice || 2000
  });

  // 2. Fetch fresh teams and players to guarantee exact purse balance in Firestore
  const [teamsSnap, playersSnap] = await Promise.all([
    getDocs(collection(db, TEAMS_COL)),
    getDocs(collection(db, PLAYERS_COL))
  ]);

  let matchedTeamDocId: string | null = null;
  let matchedTeamName: string = buyerTeamName || 'Franchise';
  let matchedTotalCap = INITIAL_PURSE; // 60,000

  for (const tDoc of teamsSnap.docs) {
    const tData = tDoc.data() as Team;
    if (
      tDoc.id === buyerTeamId ||
      (buyerTeamId && tDoc.id.toLowerCase() === buyerTeamId.toLowerCase()) ||
      (buyerTeamName && tData.name.toLowerCase() === buyerTeamName.toLowerCase()) ||
      (buyerTeamName && tData.shortName?.toLowerCase() === buyerTeamName.toLowerCase())
    ) {
      matchedTeamDocId = tDoc.id;
      matchedTeamName = tData.name;
      matchedTotalCap = tData.totalPurse || INITIAL_PURSE;
      break;
    }
  }

  let finalRemainingPurse = matchedTotalCap;

  if (matchedTeamDocId) {
    // Calculate remaining sold players for this team (excluding this refunded player)
    const otherSoldPlayers = playersSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as Player))
      .filter(p => {
        if (p.id === player.id) return false;
        if (p.status !== 'sold') return false;
        return (
          p.soldToTeamId === matchedTeamDocId ||
          (p.soldToTeamName && p.soldToTeamName.toLowerCase() === matchedTeamName.toLowerCase())
        );
      });

    const newSpent = otherSoldPlayers.reduce((sum, p) => sum + (p.soldPrice || p.currentBid || 0), 0);
    finalRemainingPurse = Math.max(0, matchedTotalCap - newSpent);
    const newCount = otherSoldPlayers.length;

    await updateDoc(doc(db, TEAMS_COL, matchedTeamDocId), {
      spentPurse: newSpent,
      remainingPurse: finalRemainingPurse,
      playersCount: newCount
    });
  } else {
    // If not matched directly, recalculate all teams to ensure no drift
    await recalculateAllTeamPurses();
  }

  // 3. Update auction state
  const auctionRef = doc(db, 'system', AUCTION_DOC);
  if (reAuctionImmediately) {
    await updateDoc(auctionRef, {
      activePlayerId: player.id,
      status: 'bidding',
      currentBid: player.basePrice || 2000,
      currentBidTeamId: null,
      currentBidTeamName: null,
      hammerCount: 0,
      lastBidTime: Date.now()
    });
  } else {
    try {
      const auctionSnap = await getDoc(auctionRef);
      if (auctionSnap.exists()) {
        const data = auctionSnap.data();
        if (data.activePlayerId === player.id) {
          await updateDoc(auctionRef, {
            status: 'idle',
            currentBid: player.basePrice || 2000,
            currentBidTeamId: null,
            currentBidTeamName: null,
            hammerCount: 0
          });
        }
      }
    } catch {
      // Ignore if document not found
    }
  }

  return { 
    refundedAmount: refundAmount, 
    teamName: matchedTeamName,
    remainingPurse: finalRemainingPurse 
  };
}
