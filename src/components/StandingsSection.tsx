import React from 'react';
import { ArrowUpDown, Star } from 'lucide-react';
import { Team, Player } from '../types/auction';

interface StandingsSectionProps {
  teams: Team[];
  players: Player[];
  lockedTeamId?: string | null;
}

export const StandingsSection: React.FC<StandingsSectionProps> = ({
  teams,
  players,
  lockedTeamId
}) => {
  // Sort teams: highest remaining purse or best standing
  const sortedTeams = [...teams].sort((a, b) => {
    return (b.remainingPurse || 0) - (a.remainingPurse || 0);
  });

  return (
    <section id="standings-section" className="mt-14 space-y-4 font-inter">
      {/* Header matching Image 5 */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309] block font-inter">
          THE LEADERBOARD OF CHAMPIONS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-playfair uppercase tracking-wide text-[#111827] mt-0.5">
          CHAMPIONSHIP STANDINGS & ROSTER BALANCE
        </h2>
        <p className="text-xs text-[#64748B] italic font-playfair mt-0.5">
          Comparative standings illustrating treasury allocation, marquee acquisitions, and squad strength across the competition.
        </p>
      </div>

      {/* Standings Table matching Image 5 */}
      <div className="border border-[#CBD5E1] bg-white overflow-hidden shadow-2xs">
        <div className="px-3 py-1 bg-slate-50 border-b border-slate-100 sm:hidden">
          <span className="text-[10px] text-slate-500 italic block">
            ← Swipe table horizontally to see all franchise purse & squad metrics →
          </span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[580px] text-left text-xs font-inter border-collapse">
            <thead className="bg-[#181E32] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5 text-center w-16">RANK</th>
                <th className="py-3 px-5">FRANCHISE</th>
                <th className="py-3 px-5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>FUNDS SPENT</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>TREASURY BALANCE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-5">
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <span>ROSTER (QUOTA)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-5">MARQUEE SIGNEE</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedTeams.map((team, idx) => {
                const isUserFranchise = lockedTeamId === team.id;
                const teamPlayers = players.filter(p => p.soldToTeamId === team.id);
                // Find top bought marquee player
                const marqueePlayer = [...teamPlayers].sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0))[0];

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      isUserFranchise ? 'bg-amber-50/50' : idx % 2 === 0 ? 'bg-white' : 'bg-[#FDFBF7]'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-5 text-center font-bold text-base text-[#D4AF37] font-playfair">
                      {idx + 1}
                    </td>

                    {/* Franchise Details matching Image 5 */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-10 h-10 object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-sm text-[#111827] font-playfair leading-tight">
                            {team.name}
                          </div>
                          {isUserFranchise ? (
                            <span className="text-[11px] font-bold text-[#D4AF37] flex items-center space-x-1 mt-0.5">
                              <Star className="w-3 h-3 fill-current text-amber-500" />
                              <span>★ Your Franchise</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">
                              {team.shortName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Funds Spent */}
                    <td className="py-4 px-5 font-bold text-slate-700">
                      ₹{(team.spentPurse || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Treasury Balance */}
                    <td className="py-4 px-5 font-bold text-[#111827] text-sm font-playfair">
                      ₹{(team.remainingPurse || 60000).toLocaleString('en-IN')}
                    </td>

                    {/* Roster Quota */}
                    <td className="py-4 px-5 font-bold text-slate-700">
                      {teamPlayers.length} / 18
                    </td>

                    {/* Marquee Signee */}
                    <td className="py-4 px-5 italic text-slate-500 font-playfair">
                      {marqueePlayer ? (
                        <span className="font-bold text-[#111827] not-italic">
                          {marqueePlayer.name} (₹{(marqueePlayer.soldPrice || marqueePlayer.currentBid).toLocaleString('en-IN')})
                        </span>
                      ) : (
                        'No marquee purchase'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
