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
      <div className="bg-[#0B101D] text-white px-2.5 sm:px-6 py-1.5 text-[10px] sm:text-[11px] font-inter flex flex-wrap items-center justify-between border-b border-white/10 gap-1.5 sm:gap-2">
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <span className="font-extrabold text-[#F59E0B] tracking-wider uppercase text-[9px] sm:text-[11px] whitespace-nowrap">
            LIVE GRAND AUCTION
          </span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="italic text-slate-300 hidden md:inline truncate text-[10px] sm:text-xs">
            DPL 2026 Auction · Official Player Auction Chronicle & Comprehensive Roster
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3 ml-auto">
          {lockedTeam ? (
            <div className="flex items-center space-x-1 sm:space-x-2 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span>{lockedTeam.shortName}</span>
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 hidden xs:inline">
                ₹{(lockedTeam.remainingPurse || 60000).toLocaleString('en-IN')}
              </span>
            </div>
          ) : null}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1 rounded transition-colors ${soundEnabled ? 'text-slate-300 hover:text-white' : 'text-slate-600'}`}
            title="Toggle Sound Effects"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Locked status or Team Login button */}
          {lockedTeam ? (
            <button
              onClick={onOpenTeamLoginModal}
              className="px-2 py-0.5 bg-[#059669] hover:bg-[#047857] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors shadow-2xs flex items-center space-x-1"
              title="Click to change or switch team"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              <span>{lockedTeam.shortName}</span>
            </button>
          ) : (
            <button 
              onClick={onOpenTeamLoginModal}
              className="px-2 sm:px-3 py-0.5 bg-[#059669] hover:bg-[#047857] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs whitespace-nowrap"
            >
              TEAM LOGIN
            </button>
          )}

          {/* OWNER BOARD Gold Button */}
          <button
            onClick={onOpenOwnerBoard}
            className="px-2 sm:px-3 py-0.5 bg-[#D4AF37] hover:bg-[#C69214] text-[#1E293B] text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1E293B] flex-shrink-0" />
            <span>OWNER BOARD</span>
          </button>
        </div>
      </div>

      {/* Main Top Header matching reference Images 3, 4, 5, 6 */}
      <header className="bg-white border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo badge and title: DPL CRICKET AUCTION */}
          <div className="flex items-center space-x-2 sm:space-x-3.5 min-w-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#181E32] border border-[#C69214] flex items-center justify-center p-1 sm:p-2 shadow-xs flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" className="w-5 h-5 sm:w-7 sm:h-7">
                <rect x="18" y="4" width="4" height="24" rx="1.5" fill="#D4AF37" transform="rotate(35 18 4)" />
                <rect x="22" y="24" width="4" height="12" rx="1" fill="#DC2626" transform="rotate(35 22 24)" />
                <circle cx="12" cy="14" r="3" fill="#DC2626" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-2xl lg:text-3xl font-black font-playfair tracking-wide text-[#111827] leading-tight truncate">
                DPL CRICKET AUCTION
              </h1>
              <p className="text-[9px] sm:text-[11px] text-[#64748B] italic font-playfair mt-0.5 truncate hidden xs:block">
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
          <div className="flex items-center space-x-2 flex-shrink-0">
            {lockedTeam ? (
              <div 
                onClick={onOpenTeamLoginModal}
                className="border border-[#CBD5E1] bg-[#FAF7F0] p-1 sm:p-1.5 px-1.5 sm:px-3 flex items-center space-x-1.5 sm:space-x-2.5 cursor-pointer hover:border-[#D4AF37] transition-all shadow-2xs"
                title="Click to change locked team"
              >
                <img
                  src={lockedTeam.logoUrl}
                  alt={lockedTeam.name}
                  className="w-5 h-5 sm:w-8 sm:h-8 object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="text-left">
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold block leading-none">
                    CHOSEN
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-[#111827] font-playfair leading-tight">
                    {lockedTeam.shortName}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenTeamLoginModal}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-[#181E32] hover:bg-[#283254] text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs whitespace-nowrap"
              >
                SELECT TEAM
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Section Tabs Bar */}
        <div className="lg:hidden border-t border-slate-100 bg-[#FAF7F0] overflow-x-auto py-1 px-2.5 scrollbar-none flex items-center space-x-3 text-[10px] font-bold font-inter whitespace-nowrap text-[#1E293B]">
          <button onClick={onEnterStage} className="py-1 px-1.5 text-[#B45309] hover:underline">
            ✦ Stage
          </button>
          <span>•</span>
          <a href="#franchises-section" className="py-1 px-1 hover:text-[#B45309]">Franchises</a>
          <span>•</span>
          <a href="#registry-section" className="py-1 px-1 hover:text-[#B45309]">Registry</a>
          <span>•</span>
          <a href="#chronicle-of-bids" className="py-1 px-1 hover:text-[#B45309]">Chronicle</a>
          <span>•</span>
          <a href="#standings-section" className="py-1 px-1 hover:text-[#B45309]">Standings</a>
          <span>•</span>
          <a href="#the-laws-section" className="py-1 px-1 hover:text-[#B45309]">Laws</a>
        </div>
      </header>
    </div>
  );
};
