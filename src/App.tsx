import React, { useState, useEffect } from 'react';
import { Team, Player, AuctionState } from './types/auction';
import { DEFAULT_TEAMS, DEFAULT_PLAYERS } from './data/initialData';
import { 
  initializeFirestoreDefaults, 
  subscribeToTeams, 
  subscribeToPlayers, 
  subscribeToAuctionState,
  setActivePlayer
} from './services/auctionService';
import { ReferenceTopNav } from './components/ReferenceTopNav';
import { ReferenceHero } from './components/ReferenceHero';
import { ReferenceAuctionStage } from './components/ReferenceAuctionStage';
import { FranchisePaddlesSection } from './components/FranchisePaddlesSection';
import { PlayerRosterSection } from './components/PlayerRosterSection';
import { ChronicleOfBidsSection } from './components/ChronicleOfBidsSection';
import { StandingsSection } from './components/StandingsSection';
import { RulesOfEngagementSection } from './components/RulesOfEngagementSection';
import { FranchiseLoginModal } from './components/FranchiseLoginModal';
import { MasterOwnerBoard } from './components/MasterOwnerBoard';

export default function App() {
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [auctionState, setAuctionState] = useState<AuctionState>({
    currentRound: 1,
    activePlayerId: DEFAULT_PLAYERS[0]?.id || null,
    status: 'idle',
    currentBid: DEFAULT_PLAYERS[0]?.basePrice || 2000,
    currentBidTeamId: null,
    currentBidTeamName: null,
    lastBidTime: Date.now(),
    hammerCount: 0,
    history: []
  });

  // Locked Franchise Team State (e.g. RCD, DSK, DKR, DR)
  // When owner logs in with secret code, they are locked to this team on the home page
  const [lockedTeamId, setLockedTeamId] = useState<string | null>('team_rcd'); // Default to RCD or null
  const [isTeamLoginModalOpen, setIsTeamLoginModalOpen] = useState(false);

  // Master Owner Board Command Center Modal (Admin email + pass)
  const [isMasterBoardOpen, setIsMasterBoardOpen] = useState(false);

  // Real-time synchronization with Google Cloud Firestore
  useEffect(() => {
    let unsubscribeTeams: (() => void) | undefined;
    let unsubscribePlayers: (() => void) | undefined;
    let unsubscribeAuction: (() => void) | undefined;

    const setupSync = async () => {
      try {
        await initializeFirestoreDefaults();

        unsubscribeTeams = subscribeToTeams((updatedTeams) => {
          if (updatedTeams.length > 0) setTeams(updatedTeams);
        });

        unsubscribePlayers = subscribeToPlayers((updatedPlayers) => {
          if (updatedPlayers.length > 0) setPlayers(updatedPlayers);
        });

        unsubscribeAuction = subscribeToAuctionState((updatedState) => {
          if (updatedState) setAuctionState(updatedState);
        });
      } catch (err) {
        console.error('Firestore init error:', err);
      }
    };

    setupSync();

    return () => {
      if (unsubscribeTeams) unsubscribeTeams();
      if (unsubscribePlayers) unsubscribePlayers();
      if (unsubscribeAuction) unsubscribeAuction();
    };
  }, []);

  const activePlayer = players.find(p => p.id === auctionState.activePlayerId) || 
    players.find(p => p.status === 'live') || 
    players.find(p => p.status === 'upcoming') || 
    players[0] || 
    null;

  const lockedTeam = teams.find(t => t.id === lockedTeamId) || null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextLot = async () => {
    const nextPlayer = players.find(p => p.status === 'upcoming' && p.id !== activePlayer?.id);
    if (nextPlayer) {
      await setActivePlayer(nextPlayer.id, nextPlayer.basePrice || 2000);
      scrollToSection('live-stage-arena');
    } else {
      alert('All scheduled player lots have completed for this session!');
    }
  };

  const handleSelectPlayerForAuction = async (player: Player) => {
    await setActivePlayer(player.id, player.basePrice || 2000);
    scrollToSection('live-stage-arena');
  };

  // Called when owner logs in with secret hidden code:
  // "in team coe login only for choose team not for upload player details or anything when a owner log in then its open back in home page and lock the franchaise/team"
  const handleLockFranchiseTeam = (team: Team) => {
    setLockedTeamId(team.id);
    setIsTeamLoginModalOpen(false);
    // Smooth scroll to the live stage arena with their paddle ready
    setTimeout(() => {
      scrollToSection('live-stage-arena');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1E293B] font-inter antialiased">
      {/* Top Header & Ticker Bar matching reference Images 3, 4, 5, 6 */}
      <ReferenceTopNav
        onEnterStage={() => scrollToSection('live-stage-arena')}
        onOpenOwnerBoard={() => setIsMasterBoardOpen(true)}
        onOpenTeamLoginModal={() => setIsTeamLoginModalOpen(true)}
        lockedTeam={lockedTeam}
        onUnlockTeam={() => setLockedTeamId(null)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* First Page Presentation matching reference Image 1: DPL 2026 PLAYER AUCTION */}
        <ReferenceHero
          spotlightPlayer={activePlayer}
          onEnterStage={() => scrollToSection('live-stage-arena')}
          onViewFranchises={() => scrollToSection('franchises-section')}
          onViewRegistry={() => scrollToSection('registry-section')}
        />

        {/* The Main Auction Stage matching reference Image 2 & live bidding console */}
        <ReferenceAuctionStage
          player={activePlayer}
          teams={teams}
          auctionState={auctionState}
          onNextLot={handleNextLot}
          onOpenOwnerBoard={() => setIsMasterBoardOpen(true)}
          lockedTeamId={lockedTeamId}
          onLockTeam={(t) => setLockedTeamId(t.id)}
        />

        {/* 4 Official Franchises & Hidden Code Paddles Section matching reference Image 3 */}
        <FranchisePaddlesSection
          teams={teams}
          players={players}
          lockedTeamId={lockedTeamId}
          onLockTeam={handleLockFranchiseTeam}
          onProceedToStage={() => scrollToSection('live-stage-arena')}
          onOpenTeamLoginModal={() => setIsTeamLoginModalOpen(true)}
        />

        {/* Complete Player Registry with 1.2 x 1.6 Ratio Photos */}
        <div id="registry-section">
          <PlayerRosterSection
            players={players}
            activePlayerId={auctionState.activePlayerId}
            onSelectPlayer={handleSelectPlayerForAuction}
          />
        </div>

        {/* Section 4: The Chronicle of Bids & Hammer Drops matching reference Image 4 */}
        <ChronicleOfBidsSection
          history={auctionState.history || []}
          players={players}
          teams={teams}
        />

        {/* Section 5: The Leaderboard of Champions & Standings matching reference Image 5 */}
        <StandingsSection
          teams={teams}
          players={players}
          lockedTeamId={lockedTeamId}
        />

        {/* Section 6: Rules of Engagement & Regulations matching reference Image 6 */}
        <RulesOfEngagementSection />
      </main>

      {/* Franchise Team Login Modal matching reference Image 1 */}
      {/* ONLY for choosing/locking a team, NOT for upload controls */}
      <FranchiseLoginModal
        isOpen={isTeamLoginModalOpen}
        onClose={() => setIsTeamLoginModalOpen(false)}
        onSuccess={handleLockFranchiseTeam}
        teams={teams}
        lockedTeamId={lockedTeamId}
      />

      {/* Master Owner Board & Database Command Center matching reference Image 2 */}
      {/* Contains upload player names, upload images in 1.2 x 1.6 ratio, edit details, database tools */}
      <MasterOwnerBoard
        isOpen={isMasterBoardOpen}
        onClose={() => setIsMasterBoardOpen(false)}
        teams={teams}
        players={players}
        activePlayerId={auctionState.activePlayerId}
        onSelectPlayerForAuction={handleSelectPlayerForAuction}
      />
    </div>
  );
}
