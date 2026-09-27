import React, { useState } from 'react';
import { 
  Gavel, 
  Sparkles, 
  Quote, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ChevronDown,
  Activity,
  Award
} from 'lucide-react';
import { Team, Player } from '../types/auction';
import { IPLHammerLogo } from './IPLHammerLogo';

interface CricketHeroBentoProps {
  teams: Team[];
  players: Player[];
  activePlayer: Player | null;
  currentBid: number;
  onScrollToHammer: () => void;
  onOpenOwnerPanel: () => void;
}

export const CricketHeroBento: React.FC<CricketHeroBentoProps> = ({
  teams,
  players,
  activePlayer,
  currentBid,
  onScrollToHammer,
  onOpenOwnerPanel
}) => {
  const cricketQuotes = [
    {
      quote: "Cricket is a game of passion, strategy, and unyielding spirit. When the hammer falls, destinies are carved in steel.",
      author: "Sir Donald Bradman",
      title: "Cricket Philosophy"
    }
  ];

  const [activeQuoteIdx] = useState(0);
  const soldCount = players.filter(p => p.status === 'sold').length;
  const remainingCount = players.filter(p => p.status !== 'sold').length;

  return (
    <section className="mb-10 pt-2 transition-all">
      {/* Cricket Quote & Headline Strip */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-blue p-6 sm:p-8 mb-6 border border-[#BFDBFE] shadow-sm">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#60A5FA]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 border border-[#BFDBFE] text-xs font-semibold text-[#1E3A8A] shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
              </span>
              <span className="tracking-wide font-inter">OFFICIAL LIVE AUCTION PORTAL</span>
            </div>

            {/* User requirement: on the first page just write DURGAPUR PREMIER LEAUGE AUCTION or nothing */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-cinzel text-[#0F172A] tracking-tight leading-[1.1]">
              DURGAPUR PREMIER LEAGUE <span className="text-[#2563EB]">AUCTION</span>
            </h1>

            {/* Cricket Quote Coat */}
            <div className="flex items-start space-x-3 pt-2">
              <Quote className="w-6 h-6 text-[#2563EB] flex-shrink-0 mt-1 opacity-80" />
              <blockquote className="text-sm sm:text-base italic text-[#475569] font-medium leading-relaxed font-inter">
                "{cricketQuotes[activeQuoteIdx].quote}"
                <span className="block mt-1 text-xs font-bold text-[#1E3A8A] not-italic">
                  — {cricketQuotes[activeQuoteIdx].author} • <span className="text-slate-400 font-normal">{cricketQuotes[activeQuoteIdx].title}</span>
                </span>
              </blockquote>
            </div>
          </div>

          {/* Action Callouts with IPL-Style Hammer Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <button
              onClick={onScrollToHammer}
              className="px-7 py-4 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] hover:from-[#172554] hover:to-[#1E40AF] text-white rounded-2xl font-bold font-inter text-sm shadow-xl shadow-[#2563EB]/30 hover:shadow-2xl hover:shadow-[#2563EB]/45 transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-4 group border border-white/25"
            >
              {/* Premium IPL Hammer Icon */}
              <div className="relative group-hover:rotate-12 transition-transform duration-300">
                <IPLHammerLogo size={42} className="drop-shadow-md" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-amber-300 uppercase tracking-widest block font-bold font-inter">
                  IPL Style Gavel Floor
                </span>
                <span className="text-base font-cinzel font-bold tracking-wide">ENTER AUCTION HAMMER</span>
              </div>
            </button>

            <button
              onClick={onOpenOwnerPanel}
              className="px-5 py-3 glass-panel hover:bg-white text-[#1E3A8A] rounded-2xl font-semibold text-xs font-inter transition-all duration-200 border border-[#CBD5E1] flex items-center justify-center space-x-2 shadow-xs hover:border-[#2563EB]"
            >
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Owner Panel (Upload Players & Photos)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asymmetric Bento Grid (Layer 3) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Bento Tile 1: Active Stage Spotlight (5 cols) */}
        <div className="md:col-span-5 glass-panel rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between img-hover-zoom relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-bl-full pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-inter tracking-wider text-[#2563EB] uppercase flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>On The Hammer Now</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#DBEAFE] text-[#1E40AF]">
                {activePlayer ? `Lot #${activePlayer.lotNumber || 1}` : 'Standby'}
              </span>
            </div>

            {activePlayer ? (
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-slate-200">
                  <img
                    src={activePlayer.photoUrl}
                    alt={activePlayer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center font-bold py-0.5">
                    {activePlayer.category}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold font-cinzel text-[#0F172A] truncate">
                    {activePlayer.name}
                  </h3>
                  <p className="text-xs text-[#64748B] font-inter">{activePlayer.battingStyle}</p>
                  <div className="mt-1.5 flex items-baseline space-x-2">
                    <span className="text-xs text-slate-500 font-medium font-inter">Current Bid:</span>
                    <span className="text-2xl font-extrabold font-teko text-[#2563EB] tracking-wide">
                      ₹{currentBid.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 font-inter">No player currently on auction.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-inter">Purse Allocation Cap:</span>
            <span className="font-bold text-[#0F172A] font-inter">₹60,000 per Franchise</span>
          </div>
        </div>

        {/* Bento Tile 2: Live Tournament Key Stats (4 cols) */}
        <div className="md:col-span-4 glass-panel rounded-3xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold font-inter tracking-wider text-[#64748B] uppercase block mb-3">
              DPL Auction Live Pulse
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] text-slate-400 block font-inter">Total Franchises</span>
                <span className="text-2xl font-black font-cinzel text-[#0F172A]">{teams.length}</span>
                <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Competing</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] text-slate-400 block font-inter">Players Pool</span>
                <span className="text-2xl font-black font-cinzel text-[#0F172A]">{players.length}</span>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Cataloged</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] text-slate-400 block font-inter">Sold Under Hammer</span>
                <span className="text-2xl font-black font-cinzel text-emerald-600">{soldCount}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Locked In</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[11px] text-slate-400 block font-inter">Remaining Lots</span>
                <span className="text-2xl font-black font-cinzel text-[#2563EB]">{remainingCount}</span>
                <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">In Queue</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 text-center font-inter">
            Real-time multi-client synchronization via Google Firestore
          </div>
        </div>

        {/* Bento Tile 3: Cricket Coat & Rule Pillar (3 cols) */}
        <div className="md:col-span-3 bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] rounded-3xl p-5 text-white shadow-md flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 font-cinzel">
                Auction Code
              </span>
            </div>
            <h4 className="text-base font-bold font-cinzel text-white leading-tight">
              Fair Play & Purse Discipline
            </h4>
            <p className="text-xs text-blue-100/80 mt-2 font-inter leading-relaxed">
              Every franchise holds a strictly audited <b>₹60,000₹</b> purse. 3 gavel strikes finalize the transaction.
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-[11px] text-blue-300 font-inter">Hammer Rule:</span>
            <span className="text-xs font-bold text-amber-300 font-cinzel uppercase">3 Gavel Calls</span>
          </div>
        </div>
      </div>
    </section>
  );
};
