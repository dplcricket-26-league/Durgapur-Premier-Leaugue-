export interface Team {
  id: string;
  name: string;
  shortName: string;
  ownerName: string;
  logoUrl: string;
  totalPurse: number; // default ₹60,000
  remainingPurse: number;
  spentPurse: number;
  playersCount: number;
  color: string;
  secondaryColor?: string;
  secretCode?: string;
  createdAt?: number;
}

export interface PlayerStats {
  matches?: number;
  runs?: number;
  wickets?: number;
  highestScore?: string;
  strikeRate?: number;
  economy?: number;
  catches?: number;
  bestBowling?: string;
}

export type PlayerCategory = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';
export type PlayerStatus = 'upcoming' | 'live' | 'sold' | 'unsold';

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  category: PlayerCategory;
  battingStyle: string; // e.g. Right Hand Bat
  bowlingStyle?: string; // e.g. Right-arm Fast Medium
  basePrice: number; // e.g. ₹500 or ₹1,000
  currentBid: number;
  soldPrice?: number;
  soldToTeamId?: string;
  soldToTeamName?: string;
  status: PlayerStatus;
  photoUrl: string;
  jerseyNumber?: number;
  age?: number;
  stats: PlayerStats;
  notes?: string;
  lotNumber?: number;
  updatedAt?: number;
}

export interface BidHistoryEntry {
  id: string;
  teamId: string;
  teamName: string;
  amount: number;
  timestamp: number;
}

export interface AuctionState {
  currentRound: number;
  activePlayerId: string | null;
  status: 'idle' | 'bidding' | 'hammer_countdown' | 'sold' | 'unsold';
  currentBid: number;
  currentBidTeamId: string | null;
  currentBidTeamName: string | null;
  lastBidTime: number;
  hammerCount: number; // 0: None, 1: Going Once, 2: Going Twice, 3: SOLD!
  history: BidHistoryEntry[];
}
