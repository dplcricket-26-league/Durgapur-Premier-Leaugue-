import React from 'react';
import { IndianRupee, Users, Award, Gavel, CheckCircle2, RotateCcw } from 'lucide-react';
import { ReferenceHammerIcon } from './ReferenceHammerIcon';

export const RulesOfEngagementSection: React.FC = () => {
  return (
    <section id="the-laws-section" className="mt-14 space-y-6 font-inter">
      {/* Header matching Image 6 */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309] block font-inter">
          THE LAWS & CODES OF THE GAVEL
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-playfair uppercase tracking-wide text-[#111827] mt-0.5">
          RULES OF ENGAGEMENT & REGULATIONS
        </h2>
        <p className="text-xs text-[#64748B] italic font-playfair mt-0.5">
          The codified governance governing franchise purses, international player quotas, bid increments, and hammer protocols.
        </p>
      </div>

      {/* 3x2 Grid matching Image 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: FRANCHISE PURSE & ROYAL TREASURY */}
        <div className="bg-white border border-[#CBD5E1] p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2.5 text-[#B45309]">
            <div className="w-8 h-8 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-base">
              ₹
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
              FRANCHISE PURSE & ROYAL TREASURY
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Each franchise commands a total opening purse of ₹60,000.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Retained stars deduct their contract values directly from the club treasury prior to the auction.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Deficit spending is unlawful. Budget preservation rules mandate sufficient remaining funds to fulfill minimum base reserves for remaining squad quotas.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: SQUAD QUOTA & ROSTER CAP */}
        <div className="bg-white border border-[#CBD5E1] p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2.5 text-[#181E32]">
            <div className="w-8 h-8 rounded-sm bg-blue-50 border border-blue-200 flex items-center justify-center text-[#181E32]">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
              SQUAD QUOTA & ROSTER CAP
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Maximum squad size is strictly capped at 18 players per franchise.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Once a club completes its quota of 18 players, its bidding paddle is officially lowered for the season.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Squads must balance their roster across Batters, All-rounders, Keepers, and Bowlers.</span>
            </li>
          </ul>
        </div>

        {/* Card 3: ALL-INDIAN DOMESTIC TALENT (DPL) */}
        <div className="bg-white border border-[#CBD5E1] p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2.5 text-[#181E32]">
            <div className="w-8 h-8 rounded-sm bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
              ALL-INDIAN DOMESTIC TALENT (DPL)
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>All players in the DPL are premier Indian domestic cricketers representing states and regions.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>No overseas player restrictions or visas apply—every franchise drafts from the unified Indian cricket talent pool.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Teams have total freedom to draft talent across every cricket specialization.</span>
            </li>
          </ul>
        </div>

        {/* Card 4: BID LADDER & INCREMENTS */}
        <div className="bg-white border border-[#CBD5E1] p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2.5 text-[#181E32]">
            <div className="w-8 h-8 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center">
              <ReferenceHammerIcon size={18} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
              BID LADDER & INCREMENTS
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Official base tiers range from ₹200 up to ₹2,000 marquee lots.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Standard increments: +₹200, +₹500, or +₹1,000 for heated bidding wars.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Custom raises can be called provided they exceed the current bid plus minimum mandatory increment.</span>
            </li>
          </ul>
        </div>

        {/* Card 5: MANUAL HAMMER & GAVEL DECREE */}
        <div className="bg-white border border-[#CBD5E1] p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2.5 text-[#181E32]">
            <div className="w-8 h-8 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
              MANUAL HAMMER & GAVEL DECREE
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>No automatic countdown timer is enforced—bidding remains open as long as franchises contest the lot.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Once bidding is complete, the auctioneer manually clicks the Hammer Logo to drop the gavel and declare the player SOLD!</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>If no club makes an opening offer at base reserve, the lot may be manually passed as UNSOLD.</span>
            </li>
          </ul>
        </div>

        {/* Card 6: ACCELERATED UNSOLD SESSION */}
        <div className="bg-white border border-[#CBD5E1] p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center space-x-2.5 text-[#181E32]">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
              ACCELERATED UNSOLD SESSION
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>After regular registry lots conclude, franchises may inaugurate the Accelerated Unsold Session.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>Unsold stars are recalled at discounted base valuations for high-intensity last-minute recruitment.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-[#B45309] font-serif font-bold">§</span>
              <span>All sales are final, bound by the official auction chronicle.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer matching Image 6 */}
      <div className="mt-14 bg-[#181E32] text-white p-6 sm:p-8 text-center space-y-2 border-t-2 border-[#D4AF37]">
        <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#D4AF37] font-playfair">
          🏏 DPL CRICKET AUCTION CHRONICLE • ANNO DOMINI 2026 🏏
        </div>
        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto italic font-inter leading-relaxed">
          Fan-made cricket player auction chronicle and tactical simulator for entertainment and strategic simulation purposes. Not affiliated with, sponsored by, or endorsed by the IPL, BCCI, or any commercial cricket franchise. All team heralds, emblems, and fictional roster profiles are original creations.
        </p>
      </div>
    </section>
  );
};
