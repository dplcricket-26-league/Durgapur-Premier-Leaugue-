import React, { useState } from 'react';
import { Key, X, Lock, ShieldCheck } from 'lucide-react';
import { TEAM_SECRET_CODES } from '../data/initialData';
import { Team } from '../types/auction';

interface FranchiseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (team: Team) => void;
  teams: Team[];
  lockedTeamId?: string | null;
}

export const FranchiseLoginModal: React.FC<FranchiseLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  teams,
  lockedTeamId
}) => {
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>('auto');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanCode = secretCode.trim();

    if (!cleanCode) {
      setError('Please enter your franchise secret hidden code.');
      return;
    }

    // Identify franchise by code
    let matchedShort: string | null = null;
    for (const [short, pass] of Object.entries(TEAM_SECRET_CODES)) {
      if (pass.toLowerCase() === cleanCode.toLowerCase()) {
        matchedShort = short;
        break;
      }
    }

    if (!matchedShort) {
      setError('Invalid hidden code! RCD is RCD367@, DSK is DSK387@, DKR is DKR358@, DR is DRR360@');
      return;
    }

    // If a specific team was chosen from dropdown, verify it matches
    if (selectedFranchiseId !== 'auto') {
      const selectedTeam = teams.find(t => t.id === selectedFranchiseId);
      if (selectedTeam && selectedTeam.shortName.toUpperCase() !== matchedShort.toUpperCase()) {
        setError(`Entered code corresponds to ${matchedShort}, not ${selectedTeam.name}.`);
        return;
      }
    }

    const teamToLock = teams.find(t => t.shortName.toUpperCase() === matchedShort?.toUpperCase());
    if (teamToLock) {
      onSuccess(teamToLock);
      onClose();
    } else {
      setError(`Team ${matchedShort} not found in roster.`);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedFranchiseId(val);
    setError(null);
    if (val !== 'auto') {
      const targetTeam = teams.find(t => t.id === val);
      if (targetTeam && TEAM_SECRET_CODES[targetTeam.shortName]) {
        // We can pre-fill or hint the code
        setSecretCode(TEAM_SECRET_CODES[targetTeam.shortName]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-inter">
      {/* Exact style matching reference Image 1 */}
      <div 
        className="w-full max-w-lg bg-[#0F172A] border-2 border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden text-white max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 1 */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex items-start justify-between gap-2">
          <div className="flex items-start space-x-2.5 sm:space-x-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
              <Key className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black font-playfair tracking-wide uppercase text-white leading-tight truncate">
                FRANCHISE TEAM LOGIN
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-inter">
                Log in with your secret code for one franchise to lock your team on the Home Page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container matching Image 1 */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
          <div className="p-3.5 sm:p-5 bg-[#182234] border border-[#27354E] rounded-xl space-y-3 sm:space-y-4">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200">
                {error}
              </div>
            )}

            {/* 1. CHOOSE YOUR FRANCHISE */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5 font-inter">
                1. CHOOSE YOUR FRANCHISE
              </label>
              <select
                value={selectedFranchiseId}
                onChange={handleDropdownChange}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="auto">Auto-Detect Franchise from Hidden Code</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. ENTER FRANCHISE HIDDEN CODE */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5 font-inter">
                2. ENTER FRANCHISE HIDDEN CODE
              </label>
              <input
                type="text"
                required
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter your franchise secret code..."
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Quick helper chips */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Official 4 Teams & Secret Passcodes:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const rcd = teams.find(t => t.shortName === 'RCD');
                    if (rcd) setSelectedFranchiseId(rcd.id);
                    setSecretCode('RCD367@');
                    setError(null);
                  }}
                  className="p-1.5 px-2 bg-red-950/40 border border-red-800/60 rounded text-left hover:border-red-500 transition-colors"
                >
                  <div className="font-bold text-red-300 text-[11px]">RCD</div>
                  <div className="font-mono text-[10px] text-red-400">RCD367@</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dsk = teams.find(t => t.shortName === 'DSK');
                    if (dsk) setSelectedFranchiseId(dsk.id);
                    setSecretCode('DSK387@');
                    setError(null);
                  }}
                  className="p-1.5 px-2 bg-amber-950/40 border border-amber-800/60 rounded text-left hover:border-amber-500 transition-colors"
                >
                  <div className="font-bold text-amber-300 text-[11px]">DSK</div>
                  <div className="font-mono text-[10px] text-amber-400">DSK387@</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dkr = teams.find(t => t.shortName === 'DKR');
                    if (dkr) setSelectedFranchiseId(dkr.id);
                    setSecretCode('DKR358@');
                    setError(null);
                  }}
                  className="p-1.5 px-2 bg-purple-950/40 border border-purple-800/60 rounded text-left hover:border-purple-500 transition-colors"
                >
                  <div className="font-bold text-purple-300 text-[11px]">DKR</div>
                  <div className="font-mono text-[10px] text-purple-400">DKR358@</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dr = teams.find(t => t.shortName === 'DR');
                    if (dr) setSelectedFranchiseId(dr.id);
                    setSecretCode('DRR360@');
                    setError(null);
                  }}
                  className="p-1.5 px-2 bg-blue-950/40 border border-blue-800/60 rounded text-left hover:border-blue-500 transition-colors"
                >
                  <div className="font-bold text-blue-300 text-[11px]">DR</div>
                  <div className="font-mono text-[10px] text-blue-400">DRR360@</div>
                </button>
              </div>
            </div>

            {/* Submit Button matching Image 1: LOGIN & LOCK FRANCHISE (GO TO HOME PAGE) */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#C69214] text-[#0F172A] font-black uppercase tracking-wider text-xs rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4 fill-current" />
                <span>LOGIN & LOCK FRANCHISE (GO TO HOME PAGE)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
