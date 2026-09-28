import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  RotateCcw, 
  Lock, 
  Send, 
  CheckCircle,
  XCircle,
  HelpCircle,
  Flame,
  Volume2,
  Key,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player, Team, AuctionState } from '../types/auction';
import { placeBid, updateHammerState, sellPlayer, markPlayerUnsold } from '../services/auctionService';
import { ReferenceHammerIcon } from './ReferenceHammerIcon';
import { TEAM_SECRET_CODES } from '../data/initialData';

interface ReferenceAuctionStageProps {
  player: Player | null;
  teams: Team[];
  auctionState: AuctionState;
  onNextLot: () => void;
  onOpenOwnerBoard: () => void;
  lockedTeamId?: string | null;
  onLockTeam?: (team: Team) => void;
}

export const ReferenceAuctionStage: React.FC<ReferenceAuctionStageProps> = ({
  player,
  teams,
  auctionState,
  onNextLot,
  onOpenOwnerBoard,
  lockedTeamId: propLockedTeamId,
  onLockTeam
}) => {
  const [localLockedTeamId, setLocalLockedTeamId] = useState<string | null>(null);
  const lockedTeamId = propLockedTeamId !== undefined ? propLockedTeamId : localLockedTeamId;
  const [enteredPasscode, setEnteredPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [isHammerAnimating, setIsHammerAnimating] = useState(false);
  const [gavelCommentary, setGavelCommentary] = useState<string[]>([
    'Auctioneer awaiting first lot...'
  ]);

  const activeTeam = teams.find(t => t.id === lockedTeamId);
  const highestBidTeam = teams.find(t => t.id === auctionState.currentBidTeamId);
  const currentBid = auctionState.currentBid || player?.basePrice || 2000;
  const reservePrice = player?.basePrice || 2000;

  const quickIncrements = [200, 500, 1000];

  const addCommentary = (text: string) => {
    setGavelCommentary(prev => [text, ...prev.slice(0, 6)]);
  };

  const playGavelSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 520;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {
      // AudioContext fallback
    }
  };

  // Authenticate team with the confidential hidden codes:
  // RCD: RCD367@, DSK: DSK387@, DKR: DKR358@, DR: DRR360@
  const handleLockTeamByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    const code = enteredPasscode.trim();

    if (!code) {
      setPasscodeError('Please enter franchise secret code');
      return;
    }

    // Match code to team
    let matchedShortCode: string | null = null;
    for (const [short, secret] of Object.entries(TEAM_SECRET_CODES)) {
      if (secret === code) {
        matchedShortCode = short;
        break;
      }
    }

    if (matchedShortCode) {
      const foundTeam = teams.find(t => t.shortName.toUpperCase() === matchedShortCode);
      if (foundTeam) {
        setLocalLockedTeamId(foundTeam.id);
        if (onLockTeam) onLockTeam(foundTeam);
        setEnteredPasscode('');
        addCommentary(`Franchise ${foundTeam.name} (${foundTeam.shortName}) authorized & locked with code!`);
      } else {
        setPasscodeError(`Team ${matchedShortCode} not loaded yet`);
      }
    } else {
      setPasscodeError('Invalid secret code. Please enter your confidential franchise passcode.');
    }
  };

  const handlePlaceIncrementBid = async (inc: number) => {
    if (!player) return;

    if (!activeTeam) {
      alert('Please enter your team hidden code to lock your franchise paddle before bidding.');
      return;
    }

    const newAmount = currentBid + inc;
    if (activeTeam.remainingPurse < newAmount) {
      alert(`Insufficient purse: ${activeTeam.name} has ₹${activeTeam.remainingPurse.toLocaleString('en-IN')}`);
      return;
    }

    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 500);
    playGavelSound();

    addCommentary(`Bid of ₹${newAmount.toLocaleString('en-IN')} submitted by ${activeTeam.name}`);
    await placeBid(activeTeam, newAmount, player.id);
  };

  const handleCustomBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player) return;

    if (!activeTeam) {
      alert('Please enter your team hidden code to lock your franchise paddle before bidding.');
      return;
    }

    const amount = Number(customBidAmount);
    if (!amount || amount <= currentBid) {
      alert(`Bid must exceed current offer of ₹${currentBid.toLocaleString('en-IN')}`);
      return;
    }

    if (activeTeam.remainingPurse < amount) {
      alert(`Insufficient purse: ${activeTeam.name} has ₹${activeTeam.remainingPurse.toLocaleString('en-IN')}`);
      return;
    }

    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 500);
    playGavelSound();

    addCommentary(`Special paddle offer of ₹${amount.toLocaleString('en-IN')} raised by ${activeTeam.name}`);
    await placeBid(activeTeam, amount, player.id);
    setCustomBidAmount('');
  };

  const handleHammerClick = async () => {
    if (!player) return;

    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 500);
    playGavelSound();

    const nextCount = (auctionState.hammerCount || 0) + 1;
    if (nextCount < 3) {
      addCommentary(nextCount === 1 ? `GAVEL ONCE at ₹${currentBid.toLocaleString('en-IN')}!` : `GAVEL TWICE at ₹${currentBid.toLocaleString('en-IN')}!`);
      await updateHammerState(nextCount);
    } else {
      if (highestBidTeam) {
        confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
        addCommentary(`HAMMER DOWN! ${player.name} SOLD to ${highestBidTeam.name} for ₹${currentBid.toLocaleString('en-IN')}!`);
        await sellPlayer(player, highestBidTeam, currentBid);
      } else {
        await updateHammerState(3);
      }
    }
  };

  const handleHammerBidSold = async () => {
    if (!player || !highestBidTeam) {
      alert('Submit a franchise paddle offer before striking hammer sold!');
      return;
    }

    setIsHammerAnimating(true);
    setTimeout(() => setIsHammerAnimating(false), 500);
    playGavelSound();
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 } });

    addCommentary(`HAMMER SOLD! ${player.name} acquired by ${highestBidTeam.name} for ₹${currentBid.toLocaleString('en-IN')}!`);
    await sellPlayer(player, highestBidTeam, currentBid);
  };

  const handlePassUnsold = async () => {
    if (!player) return;
    if (window.confirm(`Mark ${player.name} as UNSOLD?`)) {
      addCommentary(`${player.name} PASSED UNSOLD to Recall Registry.`);
      await markPlayerUnsold(player);
    }
  };

  const isSold = player?.status === 'sold' || auctionState.status === 'sold';
  const isUnsold = player?.status === 'unsold' || auctionState.status === 'unsold';

  return (
    <div id="live-stage-arena" className="max-w-6xl mx-auto px-3 sm:px-4 mt-6 sm:mt-8 pb-12 font-inter">
      {/* Top Banner matching reference Image 2: THE MAIN AUCTION STAGE */}
      <div className="bg-white border border-[#E2E8F0] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-black font-playfair tracking-wide text-[#111827]">
            THE MAIN AUCTION STAGE
          </h2>
          <p className="text-[10px] sm:text-[11px] text-[#64748B] font-inter">
            {teams.length} Franchises In Arena • Real-time Hammer Deck
          </p>
        </div>

        {/* Action Controls in Header Bar matching reference */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* COMMENCE AUCTION */}
          <button
            onClick={() => {
              if (player) {
                addCommentary(`Auction officially commenced for ${player.name}!`);
                playGavelSound();
              }
            }}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-[#D4AF37] hover:bg-[#C69214] text-[#1E293B] text-[11px] sm:text-xs font-bold uppercase tracking-wider font-inter flex items-center justify-center space-x-1.5 transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>COMMENCE</span>
          </button>

          {/* NEXT LOT */}
          <button
            onClick={onNextLot}
            className="px-3 sm:px-3.5 py-2 bg-white hover:bg-slate-50 text-[#1E293B] border border-[#CBD5E1] text-[11px] sm:text-xs font-bold uppercase tracking-wider font-inter flex items-center space-x-1 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>NEXT LOT</span>
          </button>

          {/* HAMMER BID (SOLD) */}
          <button
            onClick={handleHammerBidSold}
            disabled={!highestBidTeam}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] text-[11px] sm:text-xs font-bold uppercase tracking-wider font-inter flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <ReferenceHammerIcon size={16} />
            <span>HAMMER (SOLD)</span>
          </button>

          {/* MARK UNSOLD */}
          <button
            onClick={handlePassUnsold}
            className="px-3 sm:px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-inter flex items-center space-x-1 transition-all"
          >
            <span>⊘ UNSOLD</span>
          </button>

          {/* REFRESH / RESET */}
          <button
            onClick={() => addCommentary('Stage refreshed.')}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-none"
            title="Refresh Stage"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stage Grid matching reference Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: PLAYER DOSSIER (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E2E8F0] p-4 min-h-[420px] shadow-2xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs font-inter mb-4">
            <span className="font-bold text-[#1E293B] uppercase tracking-wider">PLAYER DOSSIER</span>
            <span className="font-bold text-[#C69214]">LOT #{player?.lotNumber ? String(player.lotNumber).padStart(2, '0') : '00'}</span>
          </div>

          {player ? (
            <div className="space-y-4">
              {/* 1.2 x 1.6 Ratio Container so user's uploaded picture shows fully */}
              <div className="w-full aspect-[1.2/1.6] border border-[#D4AF37] bg-[#FAF7F0] overflow-hidden flex items-center justify-center p-1.5 shadow-inner">
                <img
                  src={player.photoUrl}
                  alt={player.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h4 className="font-bold font-playfair text-[#111827] text-lg leading-tight">{player.name}</h4>
                <p className="text-xs text-[#64748B] italic">{player.category} • {player.battingStyle}</p>
              </div>

              <div className="text-xs space-y-1 text-[#475569] font-inter pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Matches:</span>
                  <span className="font-bold">{player.stats?.matches || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Runs:</span>
                  <span className="font-bold">{player.stats?.runs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wickets:</span>
                  <span className="font-bold">{player.stats?.wickets || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Strike Rate:</span>
                  <span className="font-bold text-emerald-700">{player.stats?.strikeRate || '-'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-56 text-slate-400 italic text-xs font-inter text-center">
              Stage awaiting next lot...
            </div>
          )}
        </div>

        {/* Center Column: STAGE OF HONOR (Dark Blue/Navy Podium) (5 cols) */}
        <div className="lg:col-span-5 bg-[#181E32] text-white p-6 shadow-xl border-2 border-[#C69214] relative">
          <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-inter mb-4">
            <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center space-x-2">
              <ReferenceHammerIcon size={18} />
              <span>STAGE OF HONOR</span>
            </span>
            <span className="text-xs text-blue-200/80 italic font-playfair">
              {isSold ? 'Sold' : isUnsold ? 'Unsold' : 'Awaiting Hammer'}
            </span>
          </div>

          {/* Central Stage Box formatted to 1.2 x 1.6 Ratio */}
          <div className="w-full h-64 border border-white/10 bg-[#121626] flex items-center justify-center p-2 relative overflow-hidden">
            {player ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={player.photoUrl}
                  alt={player.name}
                  className="w-full h-full object-contain opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181E32]/90 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-2 left-3 text-left">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block font-inter">{player.category}</span>
                  <span className="text-xl font-bold font-playfair text-white">{player.name}</span>
                </div>

                {isSold && (
                  <div className="absolute inset-0 bg-[#064E3B]/85 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black font-playfair tracking-widest text-[#FCD34D]">SOLD</span>
                    <span className="text-xs text-white mt-1">to {player.soldToTeamName || highestBidTeam?.name}</span>
                  </div>
                )}

                {isUnsold && (
                  <div className="absolute inset-0 bg-[#881337]/85 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-playfair tracking-widest text-white">UNSOLD</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-slate-400 italic text-xs font-inter">No active lot on stage</span>
            )}
          </div>

          {/* 3 Price Metrics matching reference Image 2: CURRENT BID, RESERVE PRICE, TOP OFFER */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-5 pt-4 border-t border-white/10 text-center font-inter">
            <div className="border-r border-white/10 pr-1 sm:pr-2">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300 block truncate">CURRENT BID</span>
              <span className="text-base sm:text-2xl lg:text-3xl font-black text-[#F59E0B] font-inter block mt-0.5 truncate">
                ₹{currentBid.toLocaleString('en-IN')}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#F59E0B] font-bold block truncate">OPENING RESERVE</span>
            </div>

            <div className="border-r border-white/10 px-1 sm:px-2">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300 block truncate">RESERVE PRICE</span>
              <span className="text-base sm:text-2xl lg:text-3xl font-black text-white font-inter block mt-0.5 truncate">
                ₹{reservePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 block truncate">Base Valuation</span>
            </div>

            <div className="pl-1 sm:pl-2">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300 block truncate">TOP OFFER</span>
              <span className="text-base sm:text-2xl lg:text-3xl font-black text-emerald-400 font-inter block mt-0.5 truncate">
                ₹{currentBid.toLocaleString('en-IN')}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-emerald-300 block truncate">
                {highestBidTeam ? highestBidTeam.shortName : 'Awaiting'}
              </span>
            </div>
          </div>

          {/* Footnote text matching reference */}
          <p className="mt-5 text-[11px] text-blue-200/80 italic font-playfair text-center">
            Gavel open at base reserve • Submit franchise paddle offer, then click Hammer Logo to complete bid
          </p>
        </div>

        {/* Right Column: GAVEL DESK, BIDDING CONSOLE & LIVE COMMENTARY (4 cols) */}
        <div className="lg:col-span-4 space-y-4 font-inter">
          {/* HAMMER BOX matching reference Image 2: MANUAL AUCTIONEER HAMMER */}
          <div 
            onClick={handleHammerClick}
            className={`bg-[#181E32] text-white p-4 border border-[#C69214] flex items-center space-x-4 cursor-pointer hover:bg-[#202740] transition-all shadow-md group ${
              isHammerAnimating ? 'animate-hammer-hit' : ''
            }`}
          >
            <div className="w-16 h-16 bg-[#121626] border border-[#C69214] flex flex-col items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ReferenceHammerIcon size={34} />
              <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest mt-0.5 font-inter">HAMMER</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider font-inter">
                  MANUAL AUCTIONEER HAMMER
                </span>
                <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider bg-blue-950 px-1.5 py-0.5 border border-blue-800">
                  NO TIMER • MANUAL CONTROL
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-tight font-playfair italic">
                {auctionState.hammerCount === 0 && 'Commence the auction to bring a player to the stage.'}
                {auctionState.hammerCount === 1 && 'GOING ONCE! Click to strike twice or submit counter-bid.'}
                {auctionState.hammerCount === 2 && 'GOING TWICE! Final call before hammer down!'}
                {auctionState.hammerCount >= 3 && 'HAMMER DOWN! Lot concluded.'}
              </p>
            </div>
          </div>

          {/* BIDDING CONSOLE with exact hidden code banner matching reference Image 2 */}
          <div className="bg-white border border-[#E2E8F0] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center space-x-1.5">
                <span>⚡</span>
                <span>BIDDING CONSOLE</span>
              </span>
              <button
                onClick={onOpenOwnerBoard}
                className="text-[11px] text-[#C69214] font-bold hover:underline"
              >
                Owner Panel Login
              </button>
            </div>

            {/* Hidden Code Input Box matching reference Image 2:
                "OWNER LOGIN REQUIRED TO LOCK 1 FRANCHISE" + "Enter Owner Hidden Code..." + "LOCK TEAM" */}
            <form onSubmit={handleLockTeamByCode} className="bg-[#181E32] text-white p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#F59E0B] uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-[#F59E0B]" />
                  <span>OWNER LOGIN REQUIRED TO LOCK 1 FRANCHISE</span>
                </span>
                <span className="text-slate-400">4 Teams</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter Owner Hidden Code..."
                  value={enteredPasscode}
                  onChange={(e) => setEnteredPasscode(e.target.value)}
                  className="flex-1 min-w-0 bg-[#121626] border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C69214]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#854D0E] hover:bg-[#A16207] text-[#FEF08A] font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  LOCK TEAM
                </button>
              </div>

              {passcodeError && (
                <p className="text-[11px] text-rose-400 font-semibold">{passcodeError}</p>
              )}
            </form>

            {/* Franchise Lock Status Pill */}
            {activeTeam ? (
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
                <span>✓ Locked as <b>{activeTeam.name} ({activeTeam.shortName})</b></span>
                <button
                  type="button"
                  onClick={() => setLocalLockedTeamId(null)}
                  className="text-xs text-rose-600 underline font-bold"
                >
                  Unlock
                </button>
              </div>
            ) : (
              <div className="bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] px-3 py-1.5 text-xs font-medium flex items-center space-x-1.5">
                <span>ⓘ</span>
                <span>No Franchise Locked. Enter team hidden code (RCD, DSK, DKR, DR).</span>
              </div>
            )}

            {/* Fast Increment Buttons: +₹200, +₹500, +₹1000 matching reference */}
            <div className="grid grid-cols-3 gap-2">
              {quickIncrements.map(inc => (
                <button
                  key={inc}
                  onClick={() => handlePlaceIncrementBid(inc)}
                  className="py-2.5 px-3 bg-[#E2E8F0] hover:bg-[#D4AF37] hover:text-[#1E293B] text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  +₹{inc}
                </button>
              ))}
            </div>

            {/* Custom Sum Input & OFFER button matching reference Image 2 */}
            <form onSubmit={handleCustomBid} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Enter custom sum"
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 text-xs font-inter focus:outline-none focus:border-[#C69214]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-[#CBD5E1] hover:bg-[#D4AF37] hover:text-[#1E293B] text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center space-x-1 transition-all"
              >
                <span>OFFER</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* LIVE GAVEL WIRE & COMMENTARY matching reference Image 2 */}
          <div className="bg-white border border-[#E2E8F0] p-4 shadow-2xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs font-inter mb-2">
              <span className="font-bold text-[#1E293B] uppercase tracking-wider">LIVE GAVEL WIRE & COMMENTARY</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live</span>
              </span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs text-[#475569] font-playfair italic">
              {gavelCommentary.map((c, i) => (
                <div key={i} className="pb-1 border-b border-slate-50 last:border-0 leading-tight">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
