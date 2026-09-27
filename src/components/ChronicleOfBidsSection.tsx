import React, { useState } from 'react';
import { Gavel, Filter, ChevronDown, CheckCircle, Clock, Shield } from 'lucide-react';
import { BidHistoryEntry, Player, Team } from '../types/auction';

interface ChronicleOfBidsSectionProps {
  history: BidHistoryEntry[];
  players: Player[];
  teams: Team[];
}

export const ChronicleOfBidsSection: React.FC<ChronicleOfBidsSectionProps> = ({
  history = [],
  players = [],
  teams = []
}) => {
  const [filterType, setFilterType] = useState<'all' | 'sold' | 'passed'>('all');
  const [filterTeamId, setFilterTeamId] = useState<string>('all');

  const soldPlayers = players.filter(p => p.status === 'sold');
  const unsoldPlayers = players.filter(p => p.status === 'unsold');

  // Total count for filter badges
  const allLogsCount = history.length + soldPlayers.length + unsoldPlayers.length;
  const hammerDroppedCount = soldPlayers.length;
  const passedLotsCount = unsoldPlayers.length;

  return (
    <section id="chronicle-of-bids" className="mt-14 space-y-4 font-inter">
      {/* Header matching Image 4 */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309] block font-inter">
          THE CHRONICLE OF BIDS & HAMMER DROPS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-playfair uppercase tracking-wide text-[#111827] mt-0.5">
          AUCTION DISPATCHES & SALE LOGS
        </h2>
        <p className="text-xs text-[#64748B] italic font-playfair mt-0.5">
          A permanent ink chronicle of all bids called, gavel descents, record purchases, and lots passed under reserve.
        </p>
      </div>

      {/* Filter Bar matching Image 4 */}
      <div className="bg-white border border-[#E2E8F0] p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* All Logs Button */}
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 text-xs font-bold font-inter transition-all ${
              filterType === 'all'
                ? 'bg-[#181E32] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-[#1E293B] border border-[#CBD5E1]'
            }`}
          >
            All Logs ({allLogsCount})
          </button>

          {/* Hammer Dropped Button */}
          <button
            onClick={() => setFilterType('sold')}
            className={`px-3.5 py-1.5 text-xs font-bold font-inter transition-all ${
              filterType === 'sold'
                ? 'bg-[#181E32] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-[#1E293B] border border-[#CBD5E1]'
            }`}
          >
            Hammer Dropped ({hammerDroppedCount})
          </button>

          {/* Passed Lots Button */}
          <button
            onClick={() => setFilterType('passed')}
            className={`px-3.5 py-1.5 text-xs font-bold font-inter transition-all ${
              filterType === 'passed'
                ? 'bg-[#181E32] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-[#1E293B] border border-[#CBD5E1]'
            }`}
          >
            Passed Lots ({passedLotsCount})
          </button>
        </div>

        {/* Franchise Dropdown Filter */}
        <div className="flex items-center">
          <select
            value={filterTeamId}
            onChange={(e) => setFilterTeamId(e.target.value)}
            className="px-3.5 py-1.5 bg-white border border-[#CBD5E1] text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#181E32]"
          >
            <option value="all">All Franchises</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Ledger Display matching Image 4 */}
      {allLogsCount === 0 ? (
        <div className="border border-[#CBD5E1] bg-[#FAF7F0] p-12 text-center shadow-2xs">
          <p className="text-xs text-[#64748B] italic font-playfair">
            No auction hammer events recorded in the ledger yet. Bids and sales will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-inter">
              <thead className="bg-[#181E32] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Event Time</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Player & Lot</th>
                  <th className="py-2.5 px-4">Franchise</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {soldPlayers.map(p => (
                  <tr key={'sold_' + p.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleTimeString('en-IN') : 'Live'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase rounded">
                        HAMMER DROPPED
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#111827]">{p.name}</span>
                      <span className="text-slate-400 ml-1.5">(Lot #{p.lotNumber || '01'})</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#181E32]">
                      {p.soldToTeamName || 'Franchise'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      ₹{(p.soldPrice || p.currentBid || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}

                {history.slice(0, 10).map((h, i) => (
                  <tr key={'bid_' + i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(h.timestamp).toLocaleTimeString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] uppercase rounded">
                        PADDLE RAISED
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-medium">
                      Current Lot
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[#181E32]">
                      {h.teamName}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#181E32]">
                      ₹{h.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
