import React, { useState } from 'react';
import { Shield, Volume2, Sliders, Lock, CheckCircle2 } from 'lucide-react';
import { Team } from '../types/auction';

interface ReferenceTopNavProps {
  onEnterStage: () => void;
  onOpenOwnerBoard: () => void;
  onOpenTeamLoginModal: () => void;
  lockedTeam: Team | null;
  onUnlockTeam?: () => void;
}

export const ReferenceTopNav: React.FC<ReferenceTopNavProps> = ({
  onEnterStage,
  onOpenOwnerBoard,
  onOpenTeamLoginModal,
  lockedTeam,
  onUnlockTeam
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div>
      {/* Top Black Ticker Bar matching reference Images 3, 4, 5, 6 */}
      <div className="bg-[#0B101D] text-white px-4 sm:px-6 py-1.5 text-[11px] font-inter flex flex-wrap items-center justify-between border-b border-white/10 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-[#F59E0B] tracking-wider uppercase">
            LIVE GRAND AUCTION
          </span>
          <span className="text-slate-400">·</span>
          <span className="italic text-slate-300">
            DPL 2026 Auction · Official Player Auction Chronicle & Comprehensive Roster
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {lockedTeam ? (
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>LOCKED: {lockedTeam.shortName}</span>
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">
                Purse: <span className="font-bold text-white">₹{(lockedTeam.remainingPurse || 60000).toLocaleString('en-IN')}</span> (0/18)
              </span>
            </div>
          ) : null}

          {/* Sound & Controls Icons */}
          <button
            onClick={toggleSound}
            className={`p-1 rounded transition-colors ${soundEnabled ? 'text-slate-300 hover:text-white' : 'text-slate-600'}`}
            title="Toggle Sound Effects"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => alert('DPL 2026 Season: Real-time Cloud Firestore synchronization enabled.')}
            className="p-1 rounded text-slate-300 hover:text-white transition-colors"
            title="League Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Locked status or Team Login button */}
          {lockedTeam ? (
            <button
              onClick={onOpenTeamLoginModal}
              className="px-3 py-0.5 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-black uppercase tracking-wider transition-colors shadow-2xs flex items-center space-x-1"
              title="Click to change or switch team"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>{lockedTeam.shortName} LOCKED</span>
            </button>
          ) : (
            <button 
              onClick={onOpenTeamLoginModal}
              className="px-3 py-0.5 bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              TEAM LOGIN
            </button>
          )}

          {/* OWNER BOARD Gold Button */}
          <button
            onClick={onOpenOwnerBoard}
            className="px-3 py-0.5 bg-[#D4AF37] hover:bg-[#C69214] text-[#1E293B] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 transition-colors shadow-2xs"
          >
            <Shield className="w-3 h-3 text-[#1E293B]" />
            <span>OWNER BOARD</span>
          </button>
        </div>
      </div>

      {/* Main Top Header matching reference Images 3, 4, 5, 6 */}
      <header className="bg-white border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo badge and title: DPL CRICKET AUCTION */}
          <div className="flex items-center space-x-3.5 flex-shrink-0">
            <div className="w-12 h-12 bg-[#181E32] border border-[#C69214] flex items-center justify-center p-2 shadow-xs">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect x="18" y="4" width="4" height="24" rx="1.5" fill="#D4AF37" transform="rotate(35 18 4)" />
                <rect x="22" y="24" width="4" height="12" rx="1" fill="#DC2626" transform="rotate(35 22 24)" />
                <circle cx="12" cy="14" r="3" fill="#DC2626" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-playfair tracking-wide text-[#111827] leading-none">
                DPL CRICKET AUCTION
              </h1>
              <p className="text-[11px] text-[#64748B] italic font-playfair mt-0.5">
                The Grand Chronicle of Champions · Season 2026
              </p>
            </div>
          </div>

          {/* Navigation Links matching reference Images: The Stage • Franchises • Player Registry • Chronicle of Bids • Standings • The Laws */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-inter font-bold text-[#1E293B]">
            <button onClick={onEnterStage} className="hover:text-[#C69214] transition-colors">
              The Stage
            </button>
            <a href="#franchises-section" className="hover:text-[#C69214] transition-colors">
              Franchises
            </a>
            <a href="#registry-section" className="hover:text-[#C69214] transition-colors">
              Player Registry
            </a>
            <a href="#chronicle-of-bids" className="hover:text-[#C69214] transition-colors">
              Chronicle of Bids
            </a>
            <a href="#standings-section" className="hover:text-[#C69214] transition-colors">
              Standings
            </a>
            <a href="#the-laws-section" className="hover:text-[#C69214] transition-colors">
              The Laws
            </a>
          </nav>

          {/* Right CHOSEN FRANCHISE Badge matching Images 3, 4, 5, 6 */}
          <div className="flex items-center space-x-2">
            {lockedTeam ? (
              <div 
                onClick={onOpenTeamLoginModal}
                className="border border-[#CBD5E1] bg-[#FAF7F0] p-1.5 px-3 flex items-center space-x-2.5 cursor-pointer hover:border-[#D4AF37] transition-all shadow-2xs"
                title="Click to change locked team"
              >
                <img
                  src={lockedTeam.logoUrl}
                  alt={lockedTeam.name}
                  className="w-8 h-8 object-cover border border-slate-200"
                />
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block leading-none">
                    CHOSEN FRANCHISE
                  </span>
                  <span className="font-bold text-sm text-[#111827] font-playfair leading-tight">
                    {lockedTeam.shortName}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenTeamLoginModal}
                className="px-4 py-2 bg-[#181E32] hover:bg-[#283254] text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                SELECT FRANCHISE
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
