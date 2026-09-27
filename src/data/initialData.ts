import { Team, Player } from '../types/auction';

export const INITIAL_PURSE = 60000;

// 4 Official Teams with their secret hidden passcode
export const DEFAULT_TEAMS: Team[] = [
  {
    id: 'team_rcd',
    name: 'Royal Challengers Durgapur',
    shortName: 'RCD',
    ownerName: 'RCD Franchisee',
    logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80',
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    spentPurse: 0,
    playersCount: 0,
    color: '#DC2626', // Red & Gold
    secondaryColor: '#F59E0B',
    secretCode: 'RCD367@'
  },
  {
    id: 'team_dsk',
    name: 'Durgapur Super Kings',
    shortName: 'DSK',
    ownerName: 'DSK Franchisee',
    logoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80',
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    spentPurse: 0,
    playersCount: 0,
    color: '#EAB308', // Gold & Yellow
    secondaryColor: '#CA8A04',
    secretCode: 'DSK387@'
  },
  {
    id: 'team_dkr',
    name: 'Durgapur Knight Riders',
    shortName: 'DKR',
    ownerName: 'DKR Franchisee',
    logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80',
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    spentPurse: 0,
    playersCount: 0,
    color: '#7C3AED', // Purple & Gold
    secondaryColor: '#D97706',
    secretCode: 'DKR358@'
  },
  {
    id: 'team_dr',
    name: 'Durgapur Royals',
    shortName: 'DR',
    ownerName: 'DR Franchisee',
    logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200&auto=format&fit=crop&q=80',
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    spentPurse: 0,
    playersCount: 0,
    color: '#2563EB', // Royal Blue & Pink
    secondaryColor: '#EC4899',
    secretCode: 'DRR360@'
  }
];

// Exact Team Hidden Code Mapping
// RCD: RCD367@, DSK: DSK387@, DKR: DKR358@, DR: DRR360@
export const TEAM_SECRET_CODES: Record<string, string> = {
  RCD: 'RCD367@',
  DSK: 'DSK387@',
  DKR: 'DKR358@',
  DR: 'DRR360@'
};

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'p_priyam_roy',
    name: 'Priyam Roy',
    nickname: 'Lot No. 01 Spotlight',
    category: 'All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    basePrice: 2000,
    currentBid: 2000,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    status: 'upcoming',
    lotNumber: 1,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    jerseyNumber: 1,
    age: 23,
    stats: {
      matches: 28,
      runs: 300,
      wickets: 18,
      highestScore: '74*',
      strikeRate: 154.2,
      catches: 14,
      bestBowling: '3/16'
    },
    notes: 'All-rounder • Indian • Batting: Right-hand bat'
  },
  {
    id: 'p_rohit_sharma',
    name: 'Rohit Verma',
    nickname: 'Hitman of DPL',
    category: 'Batsman',
    battingStyle: 'Right Hand Bat',
    bowlingStyle: 'Right-arm Off Break',
    basePrice: 2000,
    currentBid: 2000,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    status: 'upcoming',
    lotNumber: 2,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    jerseyNumber: 45,
    age: 26,
    stats: {
      matches: 48,
      runs: 1650,
      highestScore: '104*',
      strikeRate: 152.4,
      catches: 22
    },
    notes: 'Aggressive opening batsman with proven record in powerplay overs.'
  },
  {
    id: 'p_jasprit_bumrah',
    name: 'Jaspal Singh',
    nickname: 'Boom-Boom',
    category: 'Bowler',
    battingStyle: 'Right Hand Bat',
    bowlingStyle: 'Right-arm Fast Yorker Specialist',
    basePrice: 2500,
    currentBid: 2500,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    status: 'upcoming',
    lotNumber: 3,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    jerseyNumber: 93,
    age: 24,
    stats: {
      matches: 42,
      wickets: 68,
      bestBowling: '5/14',
      economy: 6.8,
      runs: 140
    },
    notes: 'Lethal death-over yorker specialist with 140+ kmph speed.'
  },
  {
    id: 'p_hardik_pandya',
    name: 'Karan Pandya',
    nickname: 'Clutch King',
    category: 'All-Rounder',
    battingStyle: 'Right Hand Bat',
    bowlingStyle: 'Right-arm Medium Fast',
    basePrice: 3000,
    currentBid: 3000,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    status: 'upcoming',
    lotNumber: 4,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    jerseyNumber: 33,
    age: 27,
    stats: {
      matches: 55,
      runs: 1280,
      wickets: 45,
      strikeRate: 168.2,
      bestBowling: '4/21'
    },
    notes: 'Match winner finisher and consistent 4-over bowler.'
  },
  {
    id: 'p_ms_pant',
    name: 'Rishi Pant',
    nickname: 'Lightning Gloves',
    category: 'Wicket Keeper',
    battingStyle: 'Left Hand Bat',
    bowlingStyle: 'Right-arm Off Break',
    basePrice: 2000,
    currentBid: 2000,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    status: 'upcoming',
    lotNumber: 5,
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    jerseyNumber: 17,
    age: 23,
    stats: {
      matches: 39,
      runs: 1120,
      strikeRate: 158.6,
      highestScore: '88*',
      catches: 34
    },
    notes: 'Explosive middle order wicket keeper batsman.'
  },
  {
    id: 'p_virat_kohli',
    name: 'Aakash Kohli',
    nickname: 'The Run Machine',
    category: 'Batsman',
    battingStyle: 'Right Hand Bat',
    bowlingStyle: 'Right-arm Medium',
    basePrice: 3500,
    currentBid: 3500,
    soldPrice: 0,
    soldToTeamId: '',
    soldToTeamName: '',
    status: 'upcoming',
    lotNumber: 6,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    jerseyNumber: 18,
    age: 28,
    stats: {
      matches: 62,
      runs: 2340,
      highestScore: '112',
      strikeRate: 144.5,
      catches: 29
    },
    notes: 'Highest run scorer in DPL history with immense anchor ability.'
  }
];
