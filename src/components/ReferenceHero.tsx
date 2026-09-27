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
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black font-playfair tracking-tight leading-[1.1] text-[#111827] break-words">
        DPL 2026 PLAYER<br />
        <span className="text-[#C69214] font-extrabold tracking-wide">AUCTION</span>
      </h1>

      {/* Classic Italic Quote matching reference */}
      <p className="mt-3 sm:mt-5 max-w-3xl mx-auto text-[#475569] italic text-xs sm:text-base md:text-lg font-playfair font-normal leading-relaxed px-1">
        "Assemble the finest cricketing legion, balance the club's royal treasury, and outwit the shrewd rival syndicates under the impartial decree of the auctioneer's gavel."
      </p>

      {/* Chapters Subnav: Chapters: Live Stage • Franchises • Registry • Chronicle • Standings • Laws */}
      <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-[#64748B] font-inter">
        <span className="text-[#C69214] font-bold">Chapters:</span>
        <button onClick={onEnterStage} className="font-semibold text-[#1E293B] hover:text-[#C69214] underline underline-offset-4">Live Stage</button>
        <span>•</span>
        <button onClick={onViewFranchises} className="font-semibold text-[#1E293B] hover:text-[#C69214]">Franchises</button>
        <span>•</span>
        <button onClick={onViewRegistry} className="font-semibold text-[#1E293B] hover:text-[#C69214]">Registry</button>
        <span>•</span>
        <a href="#chronicle-of-bids" className="hover:text-[#C69214]">Chronicle</a>
        <span>•</span>
        <a href="#standings-section" className="hover:text-[#C69214]">Standings</a>
        <span>•</span>
        <a href="#the-laws-section" className="hover:text-[#C69214]">Laws</a>
      </div>

      {/* 3 Prominent Action Buttons matching reference Image 1 */}
      <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {/* Button 1: ENTER THE STAGE (Gold background with play icon) */}
        <button
          onClick={onEnterStage}
          className="flex-1 sm:flex-initial min-w-[140px] px-4 sm:px-7 py-2.5 sm:py-3 bg-[#D4AF37] hover:bg-[#C69214] text-[#1E293B] rounded-sm font-bold font-inter text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>ENTER STAGE</span>
        </button>

        {/* Button 2: THE FOUR FRANCHISES (Dark Navy with shield icon) */}
        <button
          onClick={onViewFranchises}
          className="flex-1 sm:flex-initial min-w-[140px] px-4 sm:px-6 py-2.5 sm:py-3 bg-[#181E32] hover:bg-[#232B45] text-white rounded-sm font-bold font-inter text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
        >
          <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>4 FRANCHISES</span>
        </button>

        {/* Button 3: PLAYER REGISTRY (Outlined parchment with database/list icon) */}
        <button
          onClick={onViewRegistry}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50 text-[#1E293B] border border-[#CBD5E1] rounded-sm font-bold font-inter text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center space-x-1.5"
        >
          <Database className="w-3.5 h-3.5 text-[#64748B]" />
          <span>PLAYER REGISTRY</span>
        </button>
      </div>

      {/* Frontispiece • Lot No. 01 Spotlight Card matching reference Image 1 bottom */}
      {spotlightPlayer ? (
        <div className="mt-10 sm:mt-12 bg-white border border-[#D4AF37] rounded-none p-4 sm:p-6 text-left shadow-xs relative">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 text-xs font-inter mb-4 gap-2">
            <span className="font-bold text-[#1E293B] uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#D4AF37] inline-block"></span>
              <span>FRONTISPIECE • LOT NO. 01 SPOTLIGHT</span>
            </span>
            <span className="text-[#64748B] italic">Estimated Value: ₹35,000+</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Player Photo with Gold Border matching 1.2 x 1.6 ratio and showing full photo */}
            <div className="w-28 sm:w-36 aspect-[1.2/1.6] border-2 border-[#D4AF37] p-1 bg-[#FAF7F0] flex-shrink-0 shadow-xs flex items-center justify-center">
              <img
                src={spotlightPlayer.photoUrl}
                alt={spotlightPlayer.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Player Details & Key Stats in Gold/White boxes */}
            <div className="flex-1 min-w-0 space-y-3 w-full">
              <div>
                <h3 className="text-xl sm:text-3xl font-black font-playfair text-[#111827]">
                  {spotlightPlayer.name}
                </h3>
                <p className="text-xs text-[#64748B] italic font-inter mt-0.5">
                  {spotlightPlayer.category} • Indian • Batting: {spotlightPlayer.battingStyle}
                </p>
              </div>

              {/* Three Stat Cards matching reference */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
                <div className="border border-[#E2E8F0] p-2 sm:p-2.5 bg-[#FAF7F0] text-center">
                  <span className="text-[9px] sm:text-[10px] text-[#64748B] uppercase font-bold tracking-wider block font-inter">TOURNAMENT RUNS</span>
                  <span className="text-base sm:text-xl font-bold font-inter text-[#B45309]">{spotlightPlayer.stats?.runs || 0}</span>
                </div>
                <div className="border border-[#E2E8F0] p-2 sm:p-2.5 bg-[#FAF7F0] text-center">
                  <span className="text-[9px] sm:text-[10px] text-[#64748B] uppercase font-bold tracking-wider block font-inter">STRIKE RATE</span>
                  <span className="text-base sm:text-xl font-bold font-inter text-[#1E293B]">{spotlightPlayer.stats?.strikeRate || '-'}</span>
                </div>
                <div className="border border-[#E2E8F0] p-2 sm:p-2.5 bg-[#FAF7F0] text-center">
                  <span className="text-[9px] sm:text-[10px] text-[#64748B] uppercase font-bold tracking-wider block font-inter">RESERVE PRICE</span>
                  <span className="text-base sm:text-xl font-bold font-inter text-[#047857]">₹{(spotlightPlayer.basePrice || 2000).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnterStage}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#181E32] hover:bg-[#232B45] text-white text-xs font-bold uppercase font-inter tracking-wider self-center sm:self-end transition-colors"
            >
              Bid on Lot
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 sm:mt-12 bg-white border border-[#D4AF37] p-6 sm:p-8 text-center shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309] block font-inter mb-1">
            ✦ DPL 2026 PLAYER REGISTRY READY ✦
          </span>
          <h3 className="text-lg sm:text-2xl font-black font-playfair text-[#111827]">
            Official Player Rosters Awaiting Submissions
          </h3>
          <p className="text-xs text-[#64748B] italic font-playfair mt-1.5 max-w-xl mx-auto">
            "Enter the Master Owner Board to upload player names, custom photos, and base reserves. Only genuine uploaded and synced players will appear here."
          </p>
        </div>
      )}
    </div>
  );
};
