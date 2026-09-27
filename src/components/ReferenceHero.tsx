import React from 'react';
import { 
  Play, 
  Shield, 
  Database, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Player } from '../types/auction';

interface ReferenceHeroProps {
  spotlightPlayer: Player | null;
  onEnterStage: () => void;
  onViewFranchises: () => void;
  onViewRegistry: () => void;
}

export const ReferenceHero: React.FC<ReferenceHeroProps> = ({
  spotlightPlayer,
  onEnterStage,
  onViewFranchises,
  onViewRegistry
}) => {
  return (
    <div className="pt-8 pb-10 max-w-5xl mx-auto text-center px-4">
      {/* Red diamond header tag: ✦ DPL 2026 AUCTION ✦ */}
      <div className="flex items-center justify-center space-x-1.5 text-[#B91C1C] text-xs font-bold tracking-widest uppercase mb-4 font-inter">
        <span>✦</span>
        <span>DPL 2026 AUCTION</span>
        <span>✦</span>
      </div>

      {/* Main Massive Serif Heading matching reference Image 1: DPL 2026 PLAYER AUCTION */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-playfair tracking-tight leading-[1.08] text-[#111827]">
        DPL 2026 PLAYER<br />
        <span className="text-[#C69214] font-extrabold tracking-wide">AUCTION</span>
      </h1>

      {/* Classic Italic Quote matching reference */}
      <p className="mt-5 max-w-3xl mx-auto text-[#475569] italic text-base sm:text-lg font-playfair font-normal leading-relaxed">
        "Assemble the finest cricketing legion, balance the club's royal treasury, and outwit the shrewd rival syndicates under the impartial decree of the auctioneer's gavel."
      </p>

      {/* Chapters Subnav: Chapters: Live Stage • Franchises • Registry • Chronicle • Standings • Laws */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-[#64748B] font-inter">
        <span className="text-[#C69214] font-bold">Chapters:</span>
        <button onClick={onEnterStage} className="font-semibold text-[#1E293B] hover:text-[#C69214] underline underline-offset-4">Live Stage</button>
        <span>•</span>
        <button onClick={onViewFranchises} className="font-semibold text-[#1E293B] hover:text-[#C69214]">Franchises</button>
        <span>•</span>
        <button onClick={onViewRegistry} className="font-semibold text-[#1E293B] hover:text-[#C69214]">Registry</button>
        <span>•</span>
        <span className="text-slate-400">Chronicle</span>
        <span>•</span>
        <span className="text-slate-400">Standings</span>
        <span>•</span>
        <span className="text-slate-400">Laws</span>
      </div>

      {/* 3 Prominent Action Buttons matching reference Image 1 */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {/* Button 1: ENTER THE STAGE (Gold background with play icon) */}
        <button
          onClick={onEnterStage}
          className="px-7 py-3 bg-[#D4AF37] hover:bg-[#C69214] text-[#1E293B] rounded-sm font-bold font-inter text-xs tracking-wider uppercase transition-all shadow-sm flex items-center space-x-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>ENTER THE STAGE</span>
        </button>

        {/* Button 2: THE FOUR FRANCHISES (Dark Navy with shield icon) */}
        <button
          onClick={onViewFranchises}
          className="px-6 py-3 bg-[#181E32] hover:bg-[#232B45] text-white rounded-sm font-bold font-inter text-xs tracking-wider uppercase transition-all shadow-sm flex items-center space-x-2"
        >
          <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>THE FOUR FRANCHISES</span>
        </button>

        {/* Button 3: PLAYER REGISTRY (Outlined parchment with database/list icon) */}
        <button
          onClick={onViewRegistry}
          className="px-6 py-3 bg-white hover:bg-slate-50 text-[#1E293B] border border-[#CBD5E1] rounded-sm font-bold font-inter text-xs tracking-wider uppercase transition-all shadow-sm flex items-center space-x-2"
        >
          <Database className="w-3.5 h-3.5 text-[#64748B]" />
          <span>PLAYER REGISTRY</span>
        </button>
      </div>

      {/* Frontispiece • Lot No. 01 Spotlight Card matching reference Image 1 bottom */}
      {spotlightPlayer && (
        <div className="mt-12 bg-white border border-[#D4AF37] rounded-none p-6 text-left shadow-xs relative">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 text-xs font-inter mb-4">
            <span className="font-bold text-[#1E293B] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#D4AF37] inline-block"></span>
              <span>FRONTISPIECE • LOT NO. 01 SPOTLIGHT</span>
            </span>
            <span className="text-[#64748B] italic">Estimated Value: ₹35,000+</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Player Photo with Gold Border matching 1.2 x 1.6 ratio and showing full photo */}
            <div className="w-32 sm:w-36 aspect-[1.2/1.6] border-2 border-[#D4AF37] p-1 bg-[#FAF7F0] flex-shrink-0 shadow-xs flex items-center justify-center">
              <img
                src={spotlightPlayer.photoUrl}
                alt={spotlightPlayer.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Player Details & Key Stats in Gold/White boxes */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-playfair text-[#111827]">
                  {spotlightPlayer.name}
                </h3>
                <p className="text-xs text-[#64748B] italic font-inter mt-0.5">
                  {spotlightPlayer.category} • Indian • Batting: {spotlightPlayer.battingStyle}
                </p>
              </div>

              {/* Three Stat Cards matching reference */}
              <div className="grid grid-cols-3 gap-3 max-w-lg">
                <div className="border border-[#E2E8F0] p-2.5 bg-[#FAF7F0] text-center">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block font-inter">TOURNAMENT RUNS</span>
                  <span className="text-xl font-bold font-inter text-[#B45309]">{spotlightPlayer.stats?.runs || 300}</span>
                </div>
                <div className="border border-[#E2E8F0] p-2.5 bg-[#FAF7F0] text-center">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block font-inter">STRIKE RATE</span>
                  <span className="text-xl font-bold font-inter text-[#1E293B]">{spotlightPlayer.stats?.strikeRate || 154.2}</span>
                </div>
                <div className="border border-[#E2E8F0] p-2.5 bg-[#FAF7F0] text-center">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block font-inter">RESERVE PRICE</span>
                  <span className="text-xl font-bold font-inter text-[#047857]">₹{(spotlightPlayer.basePrice || 2000).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnterStage}
              className="px-5 py-2.5 bg-[#181E32] hover:bg-[#232B45] text-white text-xs font-bold uppercase font-inter tracking-wider self-center sm:self-end"
            >
              Bid on Lot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
