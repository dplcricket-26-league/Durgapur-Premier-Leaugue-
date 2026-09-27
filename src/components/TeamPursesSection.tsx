import React, { useState } from 'react';
import { Shield, Users, IndianRupee, Trophy, Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Team, Player } from '../types/auction';

interface TeamPursesSectionProps {
  teams: Team[];
  players: Player[];
}

export const TeamPursesSection: React.FC<TeamPursesSectionProps> = ({ teams, players }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const teamBoughtPlayers = players.filter(p => p.soldToTeamId === activeTeam?.id);

  return (
    <section className="mt-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel uppercase tracking-wide text-[#0F172A] flex items-center space-x-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>FRANCHISE PURSE & SQUAD STATUS (₹60,000 CAP)</span>
          </h2>
          <p className="text-xs text-[#64748B] font-inter mt-1">
            Real-time balance tracking, squad counts, and acquired players for all Durgapur Premier League franchises.
          </p>
        </div>
      </div>

      {/* Teams Cards Grid with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {teams.map((t) => {
          const isSelected = activeTeam?.id === t.id;
          const pursePercent = Math.max(0, Math.min(100, Math.round(((t.remainingPurse || 0) / (t.totalPurse || 60000)) * 100)));
          const squad = players.filter(p => p.soldToTeamId === t.id);

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`cursor-pointer rounded-3xl p-5 transition-all duration-300 border relative overflow-hidden glass-panel img-hover-zoom ${
                isSelected
                  ? 'border-[#2563EB] shadow-xl ring-2 ring-[#2563EB]/20 bg-white'
                  : 'border-[#E2E8F0] shadow-sm hover:border-[#93C5FD] hover:shadow-md'
              }`}
            >
              {/* Top Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: t.color || '#2563EB' }}
              />

              <div className="flex items-start space-x-3.5 mb-4 pt-1">
                <img
                  src={t.logoUrl}
                  alt={t.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] uppercase tracking-wider font-inter">
                    {t.shortName}
                  </span>
                  <h3 className="font-bold text-[#0F172A] text-base truncate mt-1 font-cinzel">{t.name}</h3>
                  <p className="text-xs text-[#64748B] truncate font-inter">Owner: {t.ownerName}</p>
                </div>
              </div>

              {/* Purse Numbers */}
              <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-100 text-xs font-inter">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 font-medium">Purse Balance:</span>
                  <span className="font-black text-emerald-600 text-base font-teko tracking-wide">
                    ₹{(t.remainingPurse || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${pursePercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Spent: ₹{(t.spentPurse || 0).toLocaleString('en-IN')}</span>
                  <span className="font-bold text-[#2563EB]">{squad.length} Players</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 text-center text-[11px] font-bold text-[#2563EB] uppercase tracking-wider font-inter">
                  ✓ Viewing Roster
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Team Squad Drawer / Preview */}
      {activeTeam && (
        <div className="glass-panel rounded-3xl border border-[#CBD5E1] p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3.5">
              <img 
                src={activeTeam.logoUrl} 
                alt={activeTeam.name} 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs" 
              />
              <div>
                <h3 className="text-xl font-bold font-cinzel uppercase tracking-wide text-[#0F172A]">
                  {activeTeam.name} Acquired Squad
                </h3>
                <p className="text-xs text-[#64748B] font-inter">
                  Players Signed: {teamBoughtPlayers.length} • Remaining Purse: ₹{activeTeam.remainingPurse.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="text-xs bg-[#EFF6FF] px-4 py-2 rounded-xl text-[#1E40AF] font-bold border border-[#BFDBFE] font-inter">
              Total Budget Cap: ₹{activeTeam.totalPurse.toLocaleString('en-IN')}
            </div>
          </div>

          {teamBoughtPlayers.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs font-inter">
              No players purchased yet by {activeTeam.name}. Start bidding in the live auction above!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {teamBoughtPlayers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 img-hover-zoom"
                >
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-[#0F172A] text-sm truncate font-cinzel">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold font-inter">
                        {p.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-inter">{p.battingStyle}</div>
                    <div className="text-xs font-extrabold text-emerald-700 mt-1 font-inter">
                      Sold for: ₹{(p.soldPrice || p.currentBid).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
