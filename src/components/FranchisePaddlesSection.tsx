import React, { useState } from 'react';
import { Key, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Team, Player } from '../types/auction';
import { TEAM_SECRET_CODES } from '../data/initialData';

interface FranchisePaddlesSectionProps {
  teams: Team[];
  players: Player[];
  lockedTeamId: string | null;
  onLockTeam: (team: Team) => void;
  onProceedToStage: () => void;
  onOpenTeamLoginModal: () => void;
}

const TEAM_SLOGANS: Record<string, string> = {
  RCD: '"Play Bold, Roar Proud"',
  DSK: '"Whistle With Pride"',
  DKR: '"Korbo Lorbo Jeetbo Re"',
  DR: '"Halla Bol Durgapur"'
};

export const FranchisePaddlesSection: React.FC<FranchisePaddlesSectionProps> = ({
  teams,
  players,
  lockedTeamId,
  onLockTeam,
  onProceedToStage,
  onOpenTeamLoginModal
}) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const lockedTeam = teams.find(t => t.id === lockedTeamId);

  const handleQuickUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = inputCode.trim();

    if (!code) {
      setError('Please enter your franchise secret code');
      return;
    }

    let matchedShort: string | null = null;
    for (const [short, secret] of Object.entries(TEAM_SECRET_CODES)) {
      if (secret.toLowerCase() === code.toLowerCase()) {
        matchedShort = short;
        break;
      }
    }

    if (matchedShort) {
      const targetTeam = teams.find(t => t.shortName.toUpperCase() === matchedShort?.toUpperCase());
      if (targetTeam) {
        onLockTeam(targetTeam);
        setInputCode('');
        onProceedToStage();
      }
    } else {
      setError('Invalid secret code. Please enter your confidential franchise passcode.');
    }
  };

  return (
    <section id="franchises-section" className="mt-14 space-y-6 font-inter">
      {/* Header matching Image 3 */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309] block font-inter">
          ✦ FRANCHISE OWNER AUTHENTICATION ✦
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-playfair uppercase tracking-wide text-[#111827] mt-0.5">
          OWNER HIDDEN CODE LOGIN & PADDLES
        </h2>
        <p className="text-xs text-[#64748B] italic font-playfair mt-0.5">
          Every team owner must log in with their secret hidden franchise code to unlock their team paddle and place bids.
        </p>
      </div>

      {/* Top Unlock Bar matching Image 3 */}
      <div className="bg-[#181E32] text-white p-5 border border-[#D4AF37] shadow-md">
        <form onSubmit={handleQuickUnlock} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-sm flex items-center justify-center text-[#181E32] flex-shrink-0 mt-0.5">
              <Key className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                BACKEND OWNER AUTHENTICATION
              </span>
              <h3 className="text-base font-bold font-playfair text-white">
                Enter Your Franchise Owner Hidden Code
              </h3>
              <p className="text-[11px] text-slate-300">
                Enter your secret owner code (RCD, DSK, DKR, DR) to unlock your franchise and make bids.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Owner Hidden Code..."
              className="px-3.5 py-2.5 bg-black/40 border border-[#D4AF37]/50 text-white placeholder-slate-400 text-xs font-mono tracking-wider focus:outline-none focus:border-[#D4AF37] w-full sm:w-60 min-w-0"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C69214] text-[#181E32] font-black uppercase tracking-wider text-xs whitespace-nowrap transition-colors text-center"
            >
              UNLOCK TEAM & BID
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-3 p-2 bg-red-950/80 border border-red-500/50 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Verified Unlocked Banner matching Image 3 */}
      {lockedTeam && (
        <div className="bg-white border-2 border-emerald-500 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <img
              src={lockedTeam.logoUrl}
              alt={lockedTeam.name}
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover border border-slate-200 shadow-2xs flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-700 flex items-center space-x-1 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>VERIFIED OWNER FRANCHISE UNLOCKED</span>
              </span>
              <h3 className="text-lg sm:text-xl font-black font-playfair text-[#111827] truncate">
                {lockedTeam.name} ({lockedTeam.shortName})
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 italic truncate">
                {TEAM_SLOGANS[lockedTeam.shortName] || '"Champions of Durgapur"'} · Purse: ₹{(lockedTeam.remainingPurse || 60000).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToStage}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C69214] text-[#181E32] font-black uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <span>PROCEED TO STAGE & BID</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Team Cards Grid matching Image 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {teams.map((t) => {
          const isLocked = lockedTeamId === t.id;
          const slogan = TEAM_SLOGANS[t.shortName] || '"Champions of Durgapur"';
          const squad = players.filter(p => p.soldToTeamId === t.id);

          return (
            <div
              key={t.id}
              className={`border p-5 transition-all flex flex-col justify-between ${
                isLocked
                  ? 'bg-[#181E32] text-white border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/50'
                  : 'bg-white border-[#CBD5E1] text-[#1E293B] shadow-2xs'
              }`}
            >
              <div>
                {/* Top Badge matching Image 3 */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100/20 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={t.logoUrl}
                      alt={t.name}
                      className="w-10 h-10 object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className={`font-black text-sm font-playfair leading-tight ${isLocked ? 'text-white' : 'text-[#111827]'}`}>
                        {t.name} ({t.shortName})
                      </h4>
                      <p className="text-[10px] text-slate-400 italic">
                        {slogan}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                    isLocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#181E32] text-[#D4AF37]'
                  }`}>
                    {isLocked ? 'ACTIVE OWNER' : 'CODE REQUIRED'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs py-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Franchise Code:</span>
                    <span className={`font-mono font-bold ${isLocked ? 'text-[#D4AF37]' : 'text-slate-700'}`}>
                      {t.shortName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Squad Signed:</span>
                    <span className={`font-bold ${isLocked ? 'text-white' : 'text-slate-800'}`}>
                      {squad.length} / 18 Players
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Purse and Action Button matching Image 3 */}
              <div className="pt-4 border-t border-slate-100/20 space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    REMAINING PURSE
                  </span>
                  <span className={`text-base font-black font-playfair ${isLocked ? 'text-[#D4AF37]' : 'text-[#111827]'}`}>
                    ₹{(t.remainingPurse || 60000).toLocaleString('en-IN')}
                  </span>
                </div>

                {isLocked ? (
                  <button
                    onClick={onProceedToStage}
                    className="w-full py-2.5 bg-[#D4AF37] text-[#181E32] font-black text-xs uppercase tracking-wider transition-all"
                  >
                    OWNER PADDLE ACTIVE
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Trigger modal to unlock
                      onOpenTeamLoginModal();
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-[#181E32] border border-[#CBD5E1] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>LOGIN AS {t.shortName} OWNER</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
