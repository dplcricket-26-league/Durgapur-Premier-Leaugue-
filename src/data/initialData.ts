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

export const DEFAULT_PLAYERS: Player[] = [];
