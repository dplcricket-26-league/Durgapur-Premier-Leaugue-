import React, { useState } from 'react';
import { Search, Filter, Trophy, IndianRupee, Activity, Star, Eye } from 'lucide-react';
import { Player, PlayerCategory, PlayerStatus } from '../types/auction';

interface PlayerRosterSectionProps {
  players: Player[];
  activePlayerId: string | null;
  onSelectPlayer: (player: Player) => void;
}

export const PlayerRosterSection: React.FC<PlayerRosterSectionProps> = ({
  players,
  activePlayerId,
  onSelectPlayer
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);

  const categories = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'];
  const statuses = ['All', 'upcoming', 'sold', 'unsold'];

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nickname && p.nickname.toLowerCase().includes(search.toLowerCase())) ||
      (p.battingStyle && p.battingStyle.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section className="mt-12 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel uppercase tracking-wide text-[#0F172A] flex items-center space-x-2.5">
            <Activity className="w-6 h-6 text-[#2563EB]" />
            <span>DURGAPUR PREMIER LEAGUE PLAYER POOL ({players.length})</span>
          </h2>
          <p className="text-xs text-[#64748B] font-inter mt-1">
            Browse all auction candidates, photos, career stats, base prices, and live bidding status.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search player, style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-inter focus:outline-none focus:ring-2 focus:ring-[#2563EB] w-52 shadow-2xs"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs font-inter"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs uppercase font-inter"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Players Cards Grid with Image Hover Zoom & Glassmorphic Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredPlayers.map((player) => {
          const isLive = player.id === activePlayerId || player.status === 'live';
          const isSold = player.status === 'sold';
          const isUnsold = player.status === 'unsold';

          return (
            <div
              key={player.id}
              className={`glass-panel rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 img-hover-zoom ${
                isLive
                  ? 'border-[#2563EB] shadow-xl ring-2 ring-[#2563EB]/25 bg-white'
                  : isSold
                  ? 'border-emerald-200 bg-white/70'
                  : 'border-[#E2E8F0] shadow-sm hover:border-[#93C5FD] hover:shadow-md'
              }`}
            >
              <div>
                <div className="relative mb-3.5 rounded-xl overflow-hidden border border-slate-200 bg-[#FAF7F0] w-full aspect-[1.2/1.6] flex items-center justify-center shadow-xs p-1">
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-2.5 left-2.5 bg-[#0F172A]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase font-cinzel">
                    {player.category}
                  </span>

                  {/* Status Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase shadow-xs font-inter ${
                    isSold 
                      ? 'bg-emerald-600 text-white' 
                      : isUnsold 
                      ? 'bg-rose-600 text-white' 
                      : isLive 
                      ? 'bg-amber-500 text-white animate-pulse' 
                      : 'bg-white/90 text-slate-700 backdrop-blur-xs'
                  }`}>
                    {isLive ? 'ON HAMMER' : player.status}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded font-inter">
                    Lot #{player.lotNumber || 1}
                  </span>
                </div>

                <h3 className="font-bold text-[#0F172A] text-base leading-tight truncate font-cinzel">
                  {player.name}
                </h3>
                {player.nickname && (
                  <p className="text-[11px] text-[#2563EB] italic font-inter">"{player.nickname}"</p>
                )}

                <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1 font-inter">
                  <span>{player.battingStyle}</span>
                  {player.bowlingStyle && (
                    <>
                      <span>•</span>
                      <span className="truncate">{player.bowlingStyle}</span>
                    </>
                  )}
                </div>

                {/* Quick Stats Pill */}
                <div className="grid grid-cols-3 gap-1.5 bg-[#F8FAFC] p-2.5 rounded-xl text-center text-xs mt-3.5 border border-slate-100 font-inter">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Matches</span>
                    <span className="font-extrabold text-[#0F172A]">{player.stats?.matches || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Runs</span>
                    <span className="font-extrabold text-[#2563EB]">{player.stats?.runs || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Wkts</span>
                    <span className="font-extrabold text-[#0F172A]">{player.stats?.wickets || 0}</span>
                  </div>
                </div>

                {/* Base price & Sold price */}
                <div className="mt-3.5 flex items-center justify-between text-xs font-inter">
                  <span className="text-slate-500">Base Price:</span>
                  <span className="font-bold text-[#0F172A]">₹{(player.basePrice || 2000).toLocaleString('en-IN')}</span>
                </div>

                {isSold && (
                  <div className="mt-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs font-inter">
                    <div className="flex justify-between items-center text-emerald-900">
                      <span>Sold to:</span>
                      <span className="font-bold">{player.soldToTeamName}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-700 font-extrabold mt-0.5">
                      <span>Price:</span>
                      <span>₹{(player.soldPrice || player.currentBid).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setModalPlayer(player)}
                  className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-semibold flex items-center justify-center transition-colors shadow-2xs"
                  title="View Full Stats & Details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectPlayer(player)}
                  className="flex-1 py-2.5 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-1.5 font-cinzel active:scale-95"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Bring To Hammer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Detail Modal with Glassmorphism */}
      {modalPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-[#BFDBFE] shadow-2xl">
            <div className="relative">
              <img
                src={modalPlayer.photoUrl}
                alt={modalPlayer.name}
                className="w-full h-60 object-cover"
              />
              <button
                onClick={() => setModalPlayer(null)}
                className="absolute top-3.5 right-3.5 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3.5 left-3.5 bg-[#0F172A]/90 text-white text-xs font-bold px-3 py-1 rounded-xl uppercase font-cinzel">
                {modalPlayer.category} • #{modalPlayer.jerseyNumber || 10}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-[#0F172A] leading-none">
                  {modalPlayer.name}
                </h3>
                {modalPlayer.nickname && (
                  <p className="text-xs text-[#2563EB] font-semibold italic mt-1 font-inter">"{modalPlayer.nickname}"</p>
                )}
                <p className="text-xs text-slate-500 mt-1 font-inter">
                  {modalPlayer.battingStyle} {modalPlayer.bowlingStyle ? `| ${modalPlayer.bowlingStyle}` : ''}
                </p>
              </div>

              {/* All Stats Detailed */}
              <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5 font-inter">
                  Complete DPL Tournament Record
                </span>
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-inter">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Matches</span>
                    <span className="font-extrabold text-[#0F172A] text-sm">{modalPlayer.stats?.matches || 0}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Runs</span>
                    <span className="font-extrabold text-[#2563EB] text-sm">{modalPlayer.stats?.runs || 0}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Wickets</span>
                    <span className="font-extrabold text-[#0F172A] text-sm">{modalPlayer.stats?.wickets || 0}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">High Score</span>
                    <span className="font-extrabold text-emerald-600 text-sm">{modalPlayer.stats?.highestScore || '-'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Strike Rate</span>
                    <span className="font-extrabold text-[#0F172A] text-sm">{modalPlayer.stats?.strikeRate || '-'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Best Bowling</span>
                    <span className="font-extrabold text-[#0F172A] text-sm">{modalPlayer.stats?.bestBowling || '-'}</span>
                  </div>
                </div>
              </div>

              {modalPlayer.notes && (
                <div className="text-xs text-slate-600 bg-blue-50/50 p-3.5 rounded-2xl border border-[#BFDBFE] font-inter">
                  <b>Scouting Report:</b> {modalPlayer.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 font-inter">
                  Base Price: <b className="text-[#0F172A] text-sm">₹{(modalPlayer.basePrice || 2000).toLocaleString('en-IN')}</b>
                </div>
                <button
                  onClick={() => {
                    onSelectPlayer(modalPlayer);
                    setModalPlayer(null);
                  }}
                  className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md font-cinzel transition-all active:scale-95"
                >
                  Bring To Live Hammer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
