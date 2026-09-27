import React, { useState } from 'react';
import { 
  Gavel, 
  IndianRupee, 
  Award, 
  Flame, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player, Team, AuctionState } from '../types/auction';
import { placeBid, updateHammerState, sellPlayer, markPlayerUnsold } from '../services/auctionService';
import { IPLHammerLogo } from './IPLHammerLogo';

interface HammerArenaProps {
  player: Player | null;
  teams: Team[];
  auctionState: AuctionState;
  onNextPlayerRequest?: () => void;
}

export const HammerArena: React.FC<HammerArenaProps> = ({
  player,
  teams,
  auctionState,
  onNextPlayerRequest
}) => {
  const [selectedBidTeamId, setSelectedBidTeamId] = useState<string>('');
  const [isHammerAnimating, setIsHammerAnimating] = useState(false);

  // Default select first team if not selected
  const activeBidTeam = teams.find(t => t.id === selectedBidTeamId) || teams[0];
  const highestBidTeam = teams.find(t => t.id === auctionState.currentBidTeamId);

  const currentBid = auctionState.currentBid || player?.basePrice || 2000;
  const hammerCount = auctionState.hammerCount || 0; // 0: None, 1: Once, 2: Twice, 3: SOLD!

  // Fast Bid Increment Options
  const bidIncrements = [500, 1000, 2000, 5000];

  const handlePlaceBid = async (increment: number) => {
    if (!player || !activeBidTeam) return;

    const newAmount = currentBid + increment;

    // Check if team has enough purse
    if (activeBidTeam.remainingPurse < newAmount) {
      alert(`⚠️ Insufficient Purse! ${activeBidTeam.name} has ₹${activeBidTeam.remainingPurse.toLocaleString('en-IN')} remaining.`);
      return;
    }

    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 550);
    playBeepSound(650, 120);

    await placeBid(activeBidTeam, newAmount, player.id);
  };

  const handleHammerStrike = async () => {
    if (!player) return;

    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 550);

    const nextCount = hammerCount + 1;
    playBeepSound(nextCount >= 3 ? 900 : 540, 220);

    if (nextCount < 3) {
      await updateHammerState(nextCount);
    } else {
      if (highestBidTeam) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 }
        });
        await sellPlayer(player, highestBidTeam, currentBid);
      } else {
        await updateHammerState(3);
      }
    }
  };

  const handleQuickSell = async () => {
    if (!player || !highestBidTeam) {
      alert('Please place at least one bid from a franchise before marking as SOLD!');
      return;
    }
    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 600);
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 }
    });
    playBeepSound(920, 300);
    await sellPlayer(player, highestBidTeam, currentBid);
  };

  const handleMarkUnsold = async () => {
    if (!player) return;
    if (window.confirm(`Mark ${player.name} as UNSOLD?`)) {
      await markPlayerUnsold(player);
    }
  };

  const playBeepSound = (freq: number, duration: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration / 1000);
    } catch {
      // AudioContext fallback
    }
  };

  if (!player) {
    return (
      <div id="live-hammer-arena" className="glass-panel rounded-3xl p-12 text-center border border-[#E2E8F0] shadow-sm">
        <div className="w-16 h-16 bg-[#EFF6FF] text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#BFDBFE]">
          <Gavel className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-cinzel text-[#0F172A] uppercase tracking-wide">
          AUCTION STAGE STANDBY
        </h3>
        <p className="text-sm text-[#64748B] max-w-md mx-auto mt-2 font-inter">
          No player is currently on the auction hammer. Pick any player from the roster to start live bidding!
        </p>
      </div>
    );
  }

  const isSold = player.status === 'sold' || auctionState.status === 'sold';
  const isUnsold = player.status === 'unsold' || auctionState.status === 'unsold';

  return (
    <div id="live-hammer-arena" className="glass-panel rounded-3xl border border-[#CBD5E1] shadow-xl overflow-hidden relative mb-10 transition-all duration-300">
      {/* Top Status Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-black tracking-widest text-[11px] uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md font-inter border border-white/20">
            {isSold ? 'LOT COMPLETED - SOLD' : isUnsold ? 'LOT PASSED - UNSOLD' : 'LIVE ON STAGE'}
          </span>
          <span className="text-xs text-blue-100 font-medium font-inter">
            Lot #{player.lotNumber || 1} • {player.category}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-inter">
          <span className="bg-blue-900/60 px-3 py-1 rounded-xl border border-blue-400/30 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span>Purse Cap: <b className="text-white">₹60,000₹</b></span>
          </span>
        </div>
      </div>

      {/* Main Stage Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Player Spotlight Card with Image Hover Zoom (5 cols) */}
        <div className="lg:col-span-5 glass-panel-blue rounded-3xl p-6 border border-[#BFDBFE] flex flex-col justify-between img-hover-zoom">
          <div>
            <div className="relative mb-5 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src={player.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                alt={player.name}
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider font-cinzel">
                {player.category}
              </div>
              {player.jerseyNumber && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs shadow-md font-teko text-base">
                  #{player.jerseyNumber}
                </div>
              )}

              {/* Sold Badge Overlay */}
              {isSold && (
                <div className="absolute inset-0 bg-[#064E3B]/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-2 bg-emerald-600 rounded-2xl font-cinzel font-black text-3xl uppercase tracking-widest shadow-2xl border border-emerald-400">
                    SOLD
                  </div>
                  <p className="mt-2 text-sm font-semibold text-emerald-100 font-inter">
                    Acquired by {player.soldToTeamName || highestBidTeam?.name}
                  </p>
                  <p className="font-extrabold text-3xl text-white font-teko mt-1 tracking-wider">
                    ₹{(player.soldPrice || currentBid).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              {isUnsold && (
                <div className="absolute inset-0 bg-[#881337]/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white">
                  <div className="px-6 py-2 bg-rose-600 rounded-2xl font-cinzel font-black text-3xl uppercase tracking-widest shadow-2xl border border-rose-400">
                    UNSOLD
                  </div>
                  <p className="mt-2 text-xs text-rose-100 font-inter">Eligible for accelerated second round</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-[#0F172A] tracking-wide leading-tight">
                {player.name}
              </h2>
              {player.nickname && (
                <p className="text-xs font-semibold text-[#2563EB] italic font-inter">"{player.nickname}"</p>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-inter text-[#475569]">
                <span className="bg-white/90 px-3 py-1 rounded-lg border border-slate-200 font-medium shadow-2xs">
                  🏏 {player.battingStyle || 'Right Hand'}
                </span>
                {player.bowlingStyle && (
                  <span className="bg-white/90 px-3 py-1 rounded-lg border border-slate-200 font-medium shadow-2xs">
                    ⚡ {player.bowlingStyle}
                  </span>
                )}
                {player.age && (
                  <span className="bg-white/90 px-3 py-1 rounded-lg border border-slate-200 font-medium shadow-2xs">
                    🎂 {player.age} yrs
                  </span>
                )}
              </div>
            </div>

            {/* Match Statistics Bento */}
            <div className="mt-5 pt-4 border-t border-[#BFDBFE]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2 font-inter">
                Tournament Statistics
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-inter">
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">Matches</span>
                  <span className="font-extrabold text-[#0F172A] text-sm">{player.stats?.matches || 0}</span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">Runs</span>
                  <span className="font-extrabold text-[#2563EB] text-sm">{player.stats?.runs || 0}</span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">Wickets</span>
                  <span className="font-extrabold text-[#0F172A] text-sm">{player.stats?.wickets || 0}</span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">Strike Rate</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{player.stats?.strikeRate || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#BFDBFE] flex items-center justify-between text-xs text-[#475569] font-inter">
            <span>Base Price: <b className="text-[#0F172A]">₹{(player.basePrice || 2000).toLocaleString('en-IN')}</b></span>
            <span>Lot #{player.lotNumber || 1}</span>
          </div>
        </div>

        {/* Right Column: Hammer Stage, Team Selector & Bidding Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Current Bid Display Box */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-[#2563EB]/25 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold flex items-center space-x-1.5 font-inter">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Current Highest Live Bid</span>
                </span>
                <div className="flex items-baseline space-x-3 mt-1.5">
                  <span className="text-5xl sm:text-6xl font-black font-teko tracking-normal text-white">
                    ₹{currentBid.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-blue-200 font-medium font-inter uppercase">INR</span>
                </div>
              </div>

              {/* Leading Team Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[210px]">
                <span className="text-[11px] text-blue-200 uppercase tracking-wider block mb-1 font-inter">
                  Top Bidder In Lead
                </span>
                {highestBidTeam ? (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={highestBidTeam.logoUrl} 
                      alt={highestBidTeam.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-white/20"
                    />
                    <div>
                      <div className="font-bold text-white text-sm leading-tight font-cinzel">{highestBidTeam.name}</div>
                      <span className="text-[11px] text-emerald-300 font-medium font-inter">
                        Remaining: ₹{highestBidTeam.remainingPurse.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-blue-300 italic font-inter">At Base Price (No bids yet)</span>
                )}
              </div>
            </div>

            {/* Hammer Status Steps: Going Once, Going Twice, SOLD */}
            <div className="mt-6 pt-5 border-t border-white/15">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 flex items-center space-x-1.5 font-inter">
                  <Gavel className="w-4 h-4 text-amber-400" />
                  <span>Auction Hammer Desk</span>
                </span>
                <span className="text-xs font-bold text-amber-300 font-cinzel uppercase">
                  {hammerCount === 0 && 'Awaiting Gavel Calls'}
                  {hammerCount === 1 && 'GOING ONCE! 🔨'}
                  {hammerCount === 2 && 'GOING TWICE! 🔨🔨'}
                  {hammerCount >= 3 && 'HAMMER DOWN - SOLD! 🎉'}
                </span>
              </div>

              {/* Step indicator */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className={`p-3 rounded-2xl text-center transition-all ${
                  hammerCount >= 1 
                    ? 'bg-amber-500 text-white font-bold shadow-lg' 
                    : 'bg-white/10 text-blue-200'
                }`}>
                  <span className="text-base font-cinzel font-bold tracking-wide uppercase">Going Once</span>
                </div>
                <div className={`p-3 rounded-2xl text-center transition-all ${
                  hammerCount >= 2 
                    ? 'bg-amber-600 text-white font-bold shadow-lg' 
                    : 'bg-white/10 text-blue-200'
                }`}>
                  <span className="text-base font-cinzel font-bold tracking-wide uppercase">Going Twice</span>
                </div>
                <div className={`p-3 rounded-2xl text-center transition-all ${
                  hammerCount >= 3 
                    ? 'bg-emerald-600 text-white font-bold shadow-lg' 
                    : 'bg-white/10 text-blue-200'
                }`}>
                  <span className="text-base font-cinzel font-bold tracking-wide uppercase">SOLD!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Team Selector (User Chooses Team) & Bidding Controls */}
          {!isSold && !isUnsold && (
            <div className="glass-panel border border-[#E2E8F0] rounded-3xl p-6 space-y-5">
              {/* Team Selector: 'i choose team' */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5 font-inter">
                    <Shield className="w-4 h-4 text-[#2563EB]" />
                    <span>Choose Bidding Franchise (Your Team):</span>
                  </label>
                  <span className="text-xs text-[#2563EB] font-bold font-inter">
                    Remaining: ₹{(activeBidTeam?.remainingPurse || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {teams.map((t) => {
                    const isSelected = (selectedBidTeamId ? selectedBidTeamId === t.id : teams[0]?.id === t.id);
                    const canAfford = t.remainingPurse >= (currentBid + 500);

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedBidTeamId(t.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all duration-200 relative ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md ring-2 ring-[#93C5FD]'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-[#93C5FD] hover:bg-[#F8FAFC]'
                        } ${!canAfford ? 'opacity-40' : ''}`}
                      >
                        <img 
                          src={t.logoUrl} 
                          alt={t.name} 
                          className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                            {t.shortName || t.name}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                            ₹{t.remainingPurse.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bidding Increments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#475569] uppercase tracking-wider font-inter">
                    Place Bid For <span className="text-[#2563EB] font-extrabold">{activeBidTeam?.name}</span>:
                  </span>
                  <span className="text-[11px] text-slate-400 font-inter">Click to raise instantly</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {bidIncrements.map((inc) => (
                    <button
                      key={inc}
                      onClick={() => handlePlaceBid(inc)}
                      disabled={activeBidTeam && activeBidTeam.remainingPurse < (currentBid + inc)}
                      className="py-3 px-3 bg-white hover:bg-[#2563EB] hover:text-white text-[#2563EB] border border-[#BFDBFE] hover:border-[#2563EB] rounded-2xl font-bold text-sm shadow-xs transition-all duration-200 flex flex-col items-center justify-center active:scale-95 disabled:opacity-30 disabled:pointer-events-none group"
                    >
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-100 font-inter">+ ₹</span>
                      <span className="font-extrabold text-base leading-none font-teko text-xl tracking-wide">{inc.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hammer Desk: Big Interactive Hammer Action ("You give hammer") */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5 font-inter">
                    <Gavel className="w-4 h-4 text-amber-600" />
                    <span>Official Hammer Gavel Desk:</span>
                  </span>
                  <span className="text-xs text-slate-400 font-inter">Advance hammer strikes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Hammer Strike Button */}
                  <button
                    onClick={handleHammerStrike}
                    className={`py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 border border-white/20 ${
                      isHammerAnimating ? 'animate-hammer-hit' : ''
                    }`}
                  >
                    <IPLHammerLogo size={24} className="flex-shrink-0" />
                    <span className="font-cinzel text-base tracking-wider uppercase font-bold">
                      {hammerCount === 0 && 'Hammer: Call 1'}
                      {hammerCount === 1 && 'Hammer: Call 2'}
                      {hammerCount === 2 && 'Hammer: SOLD!'}
                      {hammerCount >= 3 && 'Hammer Down'}
                    </span>
                  </button>

                  {/* Immediate Sell Button */}
                  <button
                    onClick={handleQuickSell}
                    disabled={!highestBidTeam}
                    className="py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-40 disabled:pointer-events-none border border-white/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-cinzel text-base tracking-wider uppercase font-bold">Declare SOLD</span>
                  </button>

                  {/* Mark Unsold Button */}
                  <button
                    onClick={handleMarkUnsold}
                    className="py-3.5 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 font-inter"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Pass / Unsold</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* After Sold Banner */}
          {(isSold || isUnsold) && (
            <div className="glass-panel-blue rounded-3xl p-6 border border-[#BFDBFE] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#0F172A] text-base font-cinzel">
                  {isSold ? `Lot Acquired by ${player.soldToTeamName || highestBidTeam?.name}!` : 'Player Unsold for this round'}
                </h4>
                <p className="text-xs text-[#64748B] font-inter mt-0.5">
                  {isSold ? `Team purse automatically deducted in Firebase. Stats and roster updated.` : 'Ready for the next cricketer lot.'}
                </p>
              </div>

              {onNextPlayerRequest && (
                <button
                  onClick={onNextPlayerRequest}
                  className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center space-x-2 transition-all font-inter active:scale-95"
                >
                  <span>Call Next Player</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
