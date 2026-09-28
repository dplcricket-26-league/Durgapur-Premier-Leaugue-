import React, { useState } from 'react';
import { 
  Building2, Users, Plus, Trash2, Edit3, Save, X, RotateCcw, 
  Upload, Shield, IndianRupee, Trophy, Image, Award, CheckCircle2,
  FileImage, Link, Sparkles, Key, Lock, ArrowLeft, RefreshCw, AlertTriangle, Play
} from 'lucide-react';
import { Team, Player, PlayerCategory } from '../types/auction';
import { 
  saveTeam, 
  deleteTeamDoc, 
  resetAllPurses, 
  recalculateAllTeamPurses,
  savePlayer, 
  deletePlayerDoc,
  clearAllPlayers,
  refundPlayer
} from '../services/auctionService';
import { TEAM_SECRET_CODES } from '../data/initialData';

interface OwnerPanelProps {
  teams: Team[];
  players: Player[];
  activePlayerId: string | null;
  onLogout: () => void;
  onReturnToMain?: () => void;
  onSelectPlayerForAuction: (player: Player) => void;
  authRole?: { role: 'admin' | 'team'; teamShort?: string } | null;
}

export const OwnerPanel: React.FC<OwnerPanelProps> = ({
  teams,
  players,
  activePlayerId,
  onLogout,
  onReturnToMain,
  onSelectPlayerForAuction,
  authRole
}) => {
  const [activeTab, setActiveTab] = useState<'players' | 'teams' | 'refunds' | 'team_codes'>('players');

  // Team Form State
  const [editingTeam, setEditingTeam] = useState<Partial<Team> | null>(null);
  const [teamFormOpen, setTeamFormOpen] = useState(false);

  // Player Form State
  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(null);
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'file' | 'url'>('file');

  // Refunding State
  const [refundingId, setRefundingId] = useState<string | null>(null);

  // Success Notification
  const [notice, setNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Convert uploaded image file into compressed base64 image data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size too large. Please select a photo smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // High quality canvas scaling matching 1.2 x 1.6 ratio (3:4 or 600x800)
        const canvas = document.createElement('canvas');
        const TARGET_WIDTH = 600;
        const TARGET_HEIGHT = 800; // 1.2 : 1.6 ratio
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

          // Draw full image fit into 1.2 x 1.6 box without stretching or cutting
          const imgRatio = img.width / img.height;
          const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
          let drawWidth = TARGET_WIDTH;
          let drawHeight = TARGET_HEIGHT;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > targetRatio) {
            drawHeight = TARGET_WIDTH / imgRatio;
            offsetY = (TARGET_HEIGHT - drawHeight) / 2;
          } else {
            drawWidth = TARGET_HEIGHT * imgRatio;
            offsetX = (TARGET_WIDTH - drawWidth) / 2;
          }

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          if (editingPlayer) {
            setEditingPlayer({ ...editingPlayer, photoUrl: compressedDataUrl });
            showNotification('Image loaded with 1.2x1.6 portrait ratio!');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Team Submit
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam?.name) return;

    const id = editingTeam.id || 'team_' + Date.now();
    const shortCode = editingTeam.shortName || editingTeam.name.substring(0, 3).toUpperCase();
    const teamToSave: Team = {
      id,
      name: editingTeam.name,
      shortName: shortCode,
      ownerName: editingTeam.ownerName || 'DPL Franchisee',
      logoUrl: editingTeam.logoUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80',
      totalPurse: Number(editingTeam.totalPurse) || 60000,
      remainingPurse: editingTeam.remainingPurse !== undefined ? Number(editingTeam.remainingPurse) : (Number(editingTeam.totalPurse) || 60000),
      spentPurse: editingTeam.spentPurse !== undefined ? Number(editingTeam.spentPurse) : 0,
      playersCount: editingTeam.playersCount || 0,
      color: editingTeam.color || '#1d4ed8',
      secondaryColor: editingTeam.secondaryColor || '#60a5fa',
      secretCode: TEAM_SECRET_CODES[shortCode] || editingTeam.secretCode || `${shortCode}360@`
    };

    await saveTeam(teamToSave);
    setTeamFormOpen(false);
    setEditingTeam(null);
    showNotification(`Team ${teamToSave.name} saved! Publicly visible to all users.`);
  };

  // Handle Player Submit
  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer?.name) {
      alert('Please enter the player name.');
      return;
    }

    const id = editingPlayer.id || 'p_' + Date.now();
    const playerToSave: Player = {
      id,
      name: editingPlayer.name,
      nickname: editingPlayer.nickname || '',
      category: (editingPlayer.category as PlayerCategory) || 'Batsman',
      battingStyle: editingPlayer.battingStyle || 'Right Hand Bat',
      bowlingStyle: editingPlayer.bowlingStyle || 'Right-arm Medium',
      basePrice: Number(editingPlayer.basePrice) || 2000,
      currentBid: editingPlayer.currentBid !== undefined ? Number(editingPlayer.currentBid) : (Number(editingPlayer.basePrice) || 2000),
      soldPrice: editingPlayer.soldPrice ?? 0,
      soldToTeamId: editingPlayer.soldToTeamId ?? '',
      soldToTeamName: editingPlayer.soldToTeamName ?? '',
      status: editingPlayer.status || 'upcoming',
      photoUrl: editingPlayer.photoUrl || '',
      jerseyNumber: editingPlayer.jerseyNumber ? Number(editingPlayer.jerseyNumber) : undefined,
      age: editingPlayer.age ? Number(editingPlayer.age) : 24,
      lotNumber: editingPlayer.lotNumber ? Number(editingPlayer.lotNumber) : (players.length + 1),
      stats: {
        matches: Number(editingPlayer.stats?.matches) || 0,
        runs: Number(editingPlayer.stats?.runs) || 0,
        wickets: Number(editingPlayer.stats?.wickets) || 0,
        highestScore: editingPlayer.stats?.highestScore || '0',
        strikeRate: Number(editingPlayer.stats?.strikeRate) || 0,
        economy: Number(editingPlayer.stats?.economy) || 0,
        catches: Number(editingPlayer.stats?.catches) || 0,
        bestBowling: editingPlayer.stats?.bestBowling || '-'
      },
      notes: editingPlayer.notes || ''
    };

    await savePlayer(playerToSave);
    setPlayerFormOpen(false);
    setEditingPlayer(null);
    showNotification(`Player "${playerToSave.name}" saved! Broadcaster synced to all web users.`);
  };

  const handleResetPurses = async () => {
    try {
      await resetAllPurses();
      showNotification('All 4 franchise purses have been reset to ₹60,000.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to reset team purses.');
    }
  };

  const handleRecalculatePurses = async () => {
    try {
      await recalculateAllTeamPurses();
      showNotification('✓ All franchise purses verified & synchronized with active sold rosters.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to recalculate purses.');
    }
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    try {
      await deleteTeamDoc(id);
      showNotification(`Deleted team ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlayer = async (id: string, name: string) => {
    try {
      await deletePlayerDoc(id);
      showNotification(`Deleted player ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllPlayers = async () => {
    try {
      await clearAllPlayers();
      showNotification('All players cleared! Registry is now completely clean and empty.');
    } catch (err) {
      console.error(err);
    }
  };

  // Dedicated Player Refund Handler
  // Restores franchise purse and returns player to available pool or live stage
  const handleRefundPlayer = async (player: Player, reAuction: boolean = false) => {
    setRefundingId(player.id);
    try {
      const res = await refundPlayer(player, teams, reAuction);
      showNotification(
        `✓ REFUND PROCESSED: ₹${res.refundedAmount.toLocaleString('en-IN')} credited back to ${res.teamName}! Remaining purse is now ₹${res.remainingPurse.toLocaleString('en-IN')}.`
      );
      if (reAuction) {
        onSelectPlayerForAuction(player);
      }
    } catch (err) {
      console.error('Error refunding player:', err);
      showNotification('Failed to process player refund. Check network connection.');
    } finally {
      setRefundingId(null);
    }
  };

  const soldPlayers = players.filter(p => p.status === 'sold');
  const totalSoldPurse = soldPlayers.reduce((sum, p) => sum + (p.soldPrice || p.currentBid || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] pb-16 font-inter">
      {/* Top Standalone Backend Navigation Bar */}
      <div className="bg-[#181E32] text-white px-3 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#D4AF37] sticky top-0 z-40 shadow-lg">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center text-[#181E32] flex-shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SEPARATE BACKEND PORTAL
              </span>
              <span className="text-[11px] sm:text-xs text-amber-300 font-semibold truncate">
                {authRole?.role === 'team' 
                  ? `Franchise: ${teams.find(t => t.shortName === authRole.teamShort)?.name || authRole.teamShort} (Passcode Verified)`
                  : 'Committee Master Administrator'}
              </span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black font-playfair tracking-wide text-white uppercase mt-0.5 truncate">
              DURGAPUR PREMIER LEAGUE 2026 • BACKEND CONTROL PANEL
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetPurses}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-blue-100 rounded-md transition-all shadow-xs"
            title="Reset all team budgets back to ₹60,000"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Purses (₹60k)</span>
          </button>
          <button
            onClick={onReturnToMain || onLogout}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#D4AF37] hover:bg-[#C69214] text-[#181E32] rounded-md transition-all shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Live Auction Site</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-rose-600/80 hover:bg-rose-700 text-white rounded-md transition-all"
            title="Log Out of Backend"
          >
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Real-time Notice banner */}
      {notice && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center space-x-2 text-emerald-800 text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="flex border-b border-slate-300 bg-white p-2 rounded-t-xl gap-2 shadow-2xs overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center space-x-2 px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'players'
                ? 'bg-[#181E32] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#181E32] hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Player Registry & Photos ({players.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center space-x-2 px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'teams'
                ? 'bg-[#181E32] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#181E32] hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>4 Franchise Teams & Purses ({teams.length})</span>
          </button>

          {/* Dedicated Private Refund & Re-Auction Desk Tab */}
          <button
            onClick={() => setActiveTab('refunds')}
            className={`flex items-center space-x-2 px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'refunds'
                ? 'bg-[#B45309] text-white shadow-sm ring-2 ring-amber-300'
                : 'text-slate-700 hover:text-[#B45309] hover:bg-amber-50'
            }`}
            title="Private Owner Desk: Refund player contracts and restore franchise purses"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Player Refund & Re-Auction Desk</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              soldPlayers.length > 0 
                ? 'bg-amber-400 text-slate-900' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {soldPlayers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('team_codes')}
            className={`flex items-center space-x-2 px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'team_codes'
                ? 'bg-[#181E32] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#181E32] hover:bg-slate-100'
            }`}
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>Team Hidden Codes (RCD, DSK, DKR, DR)</span>
          </button>
        </div>

        <div className="bg-white border-x border-b border-slate-300 p-6 sm:p-8 rounded-b-xl shadow-sm">
          {/* TAB 1: PLAYERS & PHOTO UPLOADS */}
          {activeTab === 'players' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F0] p-5 border border-[#D4AF37] rounded-none">
                <div>
                  <h3 className="text-xl font-bold font-playfair text-[#111827]">
                    Cricketer Dossier & Photo Upload
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Images are scaled and fitted into the <b>1.2 × 1.6 box ratio</b> to guarantee full display without distortion.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleClearAllPlayers}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider font-inter shadow-xs"
                    title="Purge all player records from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Players</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPlayer({
                        name: '',
                        nickname: '',
                        category: 'Batsman',
                        battingStyle: 'Right Hand Bat',
                        bowlingStyle: 'Right-arm Fast',
                        basePrice: 2000,
                        currentBid: 2000,
                        soldPrice: 0,
                        soldToTeamId: '',
                        soldToTeamName: '',
                        status: 'upcoming',
                        photoUrl: '',
                        age: 24,
                        lotNumber: players.length + 1,
                        stats: {
                          matches: 0,
                          runs: 0,
                          wickets: 0,
                          highestScore: '0',
                          strikeRate: 0,
                          catches: 0
                        }
                      });
                      setPlayerFormOpen(true);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C69214] text-[#181E32] text-xs font-bold uppercase tracking-wider font-inter shadow-sm flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Cricketer</span>
                  </button>
                </div>
              </div>

              {/* Player Upload Form Drawer */}
              {playerFormOpen && editingPlayer && (
                <form onSubmit={handlePlayerSubmit} className="bg-white border-2 border-[#181E32] p-6 space-y-6 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="font-bold text-[#111827] text-base font-playfair">
                      {editingPlayer.id ? `Edit Cricketer: ${editingPlayer.name}` : 'Upload New Player & Photo (1.2 × 1.6 Ratio)'}
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => { setPlayerFormOpen(false); setEditingPlayer(null); }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">
                        Player Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Virat Kohli, Priyam Roy"
                        value={editingPlayer.name || ''}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm focus:border-[#181E32] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">
                        Nickname / Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Run Machine"
                        value={editingPlayer.nickname || ''}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, nickname: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm focus:border-[#181E32] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">
                        Role / Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingPlayer.category || 'Batsman'}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, category: e.target.value as PlayerCategory })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm font-semibold focus:border-[#181E32] focus:outline-none"
                      >
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-Rounder">All-Rounder</option>
                        <option value="Wicket Keeper">Wicket Keeper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">
                        Base Reserve Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={editingPlayer.basePrice ?? 2000}
                        onChange={(e) => {
                          const bp = Number(e.target.value);
                          setEditingPlayer({ 
                            ...editingPlayer, 
                            basePrice: bp,
                            currentBid: editingPlayer.id ? editingPlayer.currentBid : bp 
                          });
                        }}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm focus:border-[#181E32] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">
                        Batting Style
                      </label>
                      <input
                        type="text"
                        placeholder="Right Hand Bat / Left Hand Bat"
                        value={editingPlayer.battingStyle || ''}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, battingStyle: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">
                        Bowling Style
                      </label>
                      <input
                        type="text"
                        placeholder="Right-arm Medium / Fast / Spin"
                        value={editingPlayer.bowlingStyle || ''}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, bowlingStyle: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* 1.2 x 1.6 Ratio Image Upload Box */}
                  <div className="bg-[#FAF7F0] p-5 border border-[#D4AF37]">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block font-bold text-[#181E32] uppercase tracking-wider text-xs flex items-center space-x-2">
                        <Image className="w-4 h-4 text-[#D4AF37]" />
                        <span>Upload Player Photo (Auto 1.2 × 1.6 Aspect Ratio Box)</span>
                      </label>
                      <div className="flex bg-white border border-slate-300 text-xs">
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('file')}
                          className={`px-3 py-1 font-semibold ${
                            imageUploadMode === 'file' ? 'bg-[#181E32] text-white' : 'text-slate-600'
                          }`}
                        >
                          From Device
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('url')}
                          className={`px-3 py-1 font-semibold ${
                            imageUploadMode === 'url' ? 'bg-[#181E32] text-white' : 'text-slate-600'
                          }`}
                        >
                          Image Link
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Image Preview Box strictly formatted to 1.2 x 1.6 ratio */}
                      <div className="md:col-span-4 flex flex-col items-center">
                        <div className="w-36 aspect-[1.2/1.6] border-2 border-[#D4AF37] bg-slate-900/5 shadow-sm flex items-center justify-center overflow-hidden p-1.5 relative">
                          {editingPlayer.photoUrl ? (
                            <img
                              src={editingPlayer.photoUrl}
                              alt="preview"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Image className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-[#C69214] mt-1.5 font-inter">
                          Ratio: 1.2 × 1.6 (Full Photo View)
                        </span>
                      </div>

                      {/* Upload Controls */}
                      <div className="md:col-span-8 space-y-3">
                        {imageUploadMode === 'file' ? (
                          <div className="border-2 border-dashed border-[#C69214] p-5 text-center bg-white hover:bg-amber-50/50 transition-colors cursor-pointer relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                              <Upload className="w-6 h-6 text-[#C69214] mb-1" />
                              <p className="text-xs font-bold text-[#181E32]">Click to select player photo from phone or computer</p>
                              <p className="text-[10px] text-slate-500">Auto-scales into 1.2 × 1.6 portrait box so the full picture is visible</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="url"
                              placeholder="Paste image web address (https://...)"
                              value={editingPlayer.photoUrl || ''}
                              onChange={(e) => setEditingPlayer({ ...editingPlayer, photoUrl: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-sm focus:border-[#181E32]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Jersey, Age & Lot */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">Jersey #</label>
                      <input
                        type="number"
                        placeholder="e.g. 18, 45, 7"
                        value={editingPlayer.jerseyNumber || ''}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, jerseyNumber: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">Age</label>
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        value={editingPlayer.age || ''}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, age: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider">Auction Lot Number</label>
                      <input
                        type="number"
                        placeholder="1, 2, 3..."
                        value={editingPlayer.lotNumber || 1}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, lotNumber: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Player Stats */}
                  <div className="pt-2 border-t border-slate-200">
                    <h5 className="font-bold text-[#111827] text-xs uppercase tracking-wider mb-2 font-inter">
                      Tournament Statistics
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 mb-1">Matches</label>
                        <input
                          type="number"
                          value={editingPlayer.stats?.matches || 0}
                          onChange={(e) => setEditingPlayer({
                            ...editingPlayer,
                            stats: { ...(editingPlayer.stats || {}), matches: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Runs</label>
                        <input
                          type="number"
                          value={editingPlayer.stats?.runs || 0}
                          onChange={(e) => setEditingPlayer({
                            ...editingPlayer,
                            stats: { ...(editingPlayer.stats || {}), runs: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Wickets</label>
                        <input
                          type="number"
                          value={editingPlayer.stats?.wickets || 0}
                          onChange={(e) => setEditingPlayer({
                            ...editingPlayer,
                            stats: { ...(editingPlayer.stats || {}), wickets: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">High Score</label>
                        <input
                          type="text"
                          value={editingPlayer.stats?.highestScore || ''}
                          placeholder="104*"
                          onChange={(e) => setEditingPlayer({
                            ...editingPlayer,
                            stats: { ...(editingPlayer.stats || {}), highestScore: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Strike Rate</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingPlayer.stats?.strikeRate || 0}
                          onChange={(e) => setEditingPlayer({
                            ...editingPlayer,
                            stats: { ...(editingPlayer.stats || {}), strikeRate: Number(e.target.value) }
                          })}
                          className="w-full px-2.5 py-1.5 border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Best Bowling</label>
                        <input
                          type="text"
                          value={editingPlayer.stats?.bestBowling || ''}
                          placeholder="5/14"
                          onChange={(e) => setEditingPlayer({
                            ...editingPlayer,
                            stats: { ...(editingPlayer.stats || {}), bestBowling: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={() => { setPlayerFormOpen(false); setEditingPlayer(null); }}
                      className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#181E32] hover:bg-[#283254] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4 text-[#D4AF37]" />
                      <span>Save & Broadcast to Web</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Players Grid Display with 1.2 x 1.6 Ratio Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {players.map((p) => {
                  const isLive = p.status === 'live' || activePlayerId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`border p-4 bg-white transition-all flex flex-col justify-between ${
                        isLive 
                          ? 'border-[#D4AF37] shadow-lg ring-2 ring-[#D4AF37]/30' 
                          : 'border-slate-200 shadow-2xs hover:border-slate-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-start space-x-3.5 mb-3">
                          {/* 1.2 x 1.6 box ratio for player photo */}
                          <div className="w-20 aspect-[1.2/1.6] border border-[#D4AF37] bg-[#FAF7F0] flex items-center justify-center overflow-hidden flex-shrink-0 p-0.5">
                            {p.photoUrl ? (
                              <img
                                src={p.photoUrl}
                                alt={p.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-slate-300" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FAF7F0] border border-[#D4AF37] text-[#181E32] uppercase">
                                Lot #{p.lotNumber || '-'}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 uppercase ${
                                p.status === 'sold'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'unsold'
                                  ? 'bg-rose-100 text-rose-800'
                                  : isLive
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {isLive ? 'ON STAGE' : p.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-[#111827] text-base truncate mt-1 font-playfair">{p.name}</h4>
                            <p className="text-xs text-[#C69214] font-semibold">{p.category}</p>
                            <p className="text-[11px] text-slate-500">{p.battingStyle}</p>
                            <div className="text-xs font-bold text-slate-800 mt-1">
                              Base: ₹{(p.basePrice || 0).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        {p.status === 'sold' && (
                          <div className="bg-amber-50 border border-amber-300 p-2.5 text-xs mb-3 text-amber-950 rounded space-y-1.5 shadow-2xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] text-slate-600">Sold to: <b className="text-slate-900 font-bold">{p.soldToTeamName}</b></span>
                              <span className="font-extrabold text-amber-800 text-xs">₹{(p.soldPrice || p.currentBid || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRefundPlayer(p, false)}
                              disabled={refundingId === p.id}
                              className="w-full py-1.5 px-2 bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1.5 rounded transition-all disabled:opacity-50 shadow-xs"
                              title="Refund player purchase and restore purse to franchise"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-200" />
                              <span>{refundingId === p.id ? 'Processing Refund...' : `Refund Player (+₹${(p.soldPrice || p.currentBid || 0).toLocaleString('en-IN')} To Purse)`}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                        <button
                          onClick={() => onSelectPlayerForAuction(p)}
                          className="flex-1 py-1.5 px-3 bg-[#181E32] hover:bg-[#283254] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1"
                        >
                          <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Bring To Stage</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingPlayer(p);
                            setPlayerFormOpen(true);
                            window.scrollTo({ top: 100, behavior: 'smooth' });
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 border border-slate-200 hover:bg-slate-50"
                          title="Edit Player Info & Photo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeletePlayer(p.id, p.name)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 border border-slate-200 hover:bg-slate-50"
                          title="Delete Player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEAMS & PURSE */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-playfair text-[#111827]">Registered DPL Franchises</h3>
                  <p className="text-xs text-slate-500">
                    4 Official Franchises: RCD, DSK, DKR, DR with ₹60,000 purse limit.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingTeam({
                      name: '',
                      shortName: '',
                      ownerName: '',
                      logoUrl: '',
                      totalPurse: 60000,
                      remainingPurse: 60000,
                      spentPurse: 0,
                      color: '#DC2626'
                    });
                    setTeamFormOpen(true);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#181E32] hover:bg-[#283254] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Franchise</span>
                </button>
              </div>

              {teamFormOpen && editingTeam && (
                <form onSubmit={handleTeamSubmit} className="bg-[#FAF7F0] border border-[#D4AF37] p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h4 className="font-bold text-[#111827] text-sm font-playfair">
                      {editingTeam.id ? 'Edit Team Details' : 'Create Franchise Team'}
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => { setTeamFormOpen(false); setEditingTeam(null); }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Team Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Challengers Durgapur"
                        value={editingTeam.name || ''}
                        onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Short Code (RCD, DSK, DKR, DR)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="e.g. RCD"
                        value={editingTeam.shortName || ''}
                        onChange={(e) => setEditingTeam({ ...editingTeam, shortName: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 text-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Owner Representative</label>
                      <input
                        type="text"
                        placeholder="Owner Name"
                        value={editingTeam.ownerName || ''}
                        onChange={(e) => setEditingTeam({ ...editingTeam, ownerName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Total Purse (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingTeam.totalPurse ?? 60000}
                        onChange={(e) => {
                          const tot = Number(e.target.value);
                          setEditingTeam({ 
                            ...editingTeam, 
                            totalPurse: tot,
                            remainingPurse: tot - (editingTeam.spentPurse || 0)
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Logo URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editingTeam.logoUrl || ''}
                        onChange={(e) => setEditingTeam({ ...editingTeam, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Theme Color</label>
                      <input
                        type="color"
                        value={editingTeam.color || '#DC2626'}
                        onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                        className="w-12 h-9 p-0.5 border border-slate-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setTeamFormOpen(false); setEditingTeam(null); }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#181E32] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Save Team
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className="border border-slate-200 p-4 bg-white shadow-2xs relative overflow-hidden"
                  >
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: t.color || '#2563EB' }}
                    />
                    <div className="flex items-start justify-between mb-3 pt-1">
                      <div className="flex items-center space-x-3">
                        <img
                          src={t.logoUrl}
                          alt={t.name}
                          className="w-12 h-12 object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-[#111827] text-sm font-playfair">{t.name}</h4>
                          <span className="text-[11px] font-bold text-[#D4AF37] uppercase">{t.shortName}</span>
                          <p className="text-[11px] text-slate-500">{t.ownerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => { setEditingTeam(t); setTeamFormOpen(true); }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(t.id, t.name)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-2.5 text-xs border border-slate-100">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Remaining:</span>
                        <span className="font-bold text-emerald-700">₹{(t.remainingPurse || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Spent:</span>
                        <span>₹{(t.spentPurse || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Squad Size:</span>
                        <span className="font-bold">{t.playersCount || 0}</span>
                      </div>
                    </div>

                    {/* Signed Players & Purse Refund Option */}
                    {(() => {
                      const signedRoster = players.filter(p => p.soldToTeamId === t.id);
                      if (signedRoster.length === 0) return null;
                      return (
                        <div className="mt-3 pt-2.5 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                            Signed Players ({signedRoster.length}):
                          </span>
                          <div className="space-y-1 max-h-36 overflow-y-auto">
                            {signedRoster.map(sp => (
                              <div key={sp.id} className="flex items-center justify-between p-1.5 bg-amber-50/60 border border-amber-200 rounded text-[11px]">
                                <div className="truncate mr-1">
                                  <span className="font-bold text-slate-900">{sp.name}</span>
                                  <span className="text-amber-800 ml-1 font-semibold">₹{(sp.soldPrice || sp.currentBid || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRefundPlayer(sp, false)}
                                  disabled={refundingId === sp.id}
                                  className="px-2 py-0.5 bg-[#B45309] hover:bg-[#92400E] text-white text-[10px] font-bold uppercase rounded flex items-center space-x-1 flex-shrink-0 disabled:opacity-50"
                                  title="Refund player contract to restore purse"
                                >
                                  <RotateCcw className="w-2.5 h-2.5" />
                                  <span>Refund</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DEDICATED PLAYER REFUND & RE-AUCTION DESK */}
          {/* CONTROL ONLY FROM OWNER PANEL - NOT PUBLIC USE */}
          {activeTab === 'refunds' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-[#FAF7F0] border-2 border-[#B45309] p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-lg bg-[#B45309] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-mono">
                          EXCLUSIVE OWNER CONTROL • PRIVATE BACKEND ONLY
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-playfair text-[#111827] mt-1">
                        Player Contract Refunds & Purse Restoration Desk
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5 max-w-2xl leading-relaxed">
                        When a player is refunded here, the full bid sum is <b>credited back directly to the franchise purse</b>, their roster count is restored, and the cricketer is released for re-auction. Public users cannot access or view this refund console.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRecalculatePurses}
                      className="px-3 py-2 bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-2xs transition-all"
                      title="Recalculate all 4 franchise balances from the database roster"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                      <span>Sync Purses</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPurses}
                      className="px-3 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-2xs transition-all"
                      title="Reset all 4 team purses to ₹60,000"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                      <span>Reset Purses to ₹60,000</span>
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5 pt-4 border-t border-amber-200">
                  <div className="bg-white p-3.5 border border-amber-300 rounded shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">TOTAL CONTRACTS SOLD</span>
                    <span className="text-2xl font-black font-playfair text-[#111827]">{soldPlayers.length}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Available for purse refund</span>
                  </div>

                  <div className="bg-white p-3.5 border border-amber-300 rounded shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">DISBURSED TREASURY FUNDS</span>
                    <span className="text-2xl font-black font-playfair text-[#B45309]">₹{totalSoldPurse.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Across all 4 official franchises</span>
                  </div>

                  <div className="bg-white p-3.5 border border-amber-300 rounded shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">AUTOMATIC PURSE REVERSAL</span>
                    <span className="text-2xl font-black font-playfair text-emerald-700">100% REAL-TIME</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Synced with Google Cloud Firestore</span>
                  </div>
                </div>
              </div>

              {/* Sold Players Roster for Refund */}
              {soldPlayers.length === 0 ? (
                <div className="border-2 border-dashed border-[#CBD5E1] bg-[#FAF7F0] p-10 sm:p-14 text-center rounded-2xl">
                  <div className="w-14 h-14 bg-white border border-[#D4AF37] rounded-xl mx-auto flex items-center justify-center text-[#B45309] mb-3 shadow-xs">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold font-playfair text-[#111827]">
                    No Player Contracts Currently Sold
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 leading-relaxed">
                    Once a player is hammered down and sold to a franchise on the Live Auction Stage, their contract record will appear here with 1-click purse refund and re-auction options.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h4 className="text-sm font-bold font-playfair text-[#111827] uppercase tracking-wide">
                      Active Signed Contracts ({soldPlayers.length})
                    </h4>
                    <span className="text-xs text-slate-500 italic">
                      Click "Refund to Purse" to credit the franchise
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {soldPlayers.map(p => {
                      const buyerTeam = teams.find(t => t.id === p.soldToTeamId) || 
                        teams.find(t => t.name.toLowerCase() === p.soldToTeamName?.toLowerCase());
                      const refundVal = p.soldPrice || p.currentBid || p.basePrice || 0;

                      return (
                        <div 
                          key={p.id}
                          className="bg-white border-2 border-amber-200 hover:border-amber-400 p-4 rounded-xl shadow-xs transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start space-x-3.5">
                              {/* 1.2 x 1.6 Ratio Player Photo */}
                              <div className="w-20 aspect-[1.2/1.6] border-2 border-[#D4AF37] bg-[#FAF7F0] flex items-center justify-center overflow-hidden flex-shrink-0 p-0.5 rounded shadow-2xs">
                                {p.photoUrl ? (
                                  <img 
                                    src={p.photoUrl} 
                                    alt={p.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Users className="w-7 h-7 text-slate-300" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FAF7F0] border border-[#D4AF37] text-[#181E32] uppercase">
                                    Lot #{p.lotNumber || '01'}
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded uppercase">
                                    SOLD CONTRACT
                                  </span>
                                </div>

                                <h4 className="text-base font-bold font-playfair text-[#111827] mt-1 truncate">
                                  {p.name}
                                </h4>
                                <p className="text-xs text-[#C69214] font-semibold">{p.category} • {p.battingStyle}</p>

                                {/* Franchise Buyer Banner */}
                                <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                                  <div className="flex items-center space-x-2 min-w-0">
                                    {buyerTeam?.logoUrl && (
                                      <img 
                                        src={buyerTeam.logoUrl} 
                                        alt={buyerTeam.name} 
                                        className="w-5 h-5 object-cover border border-slate-200 flex-shrink-0"
                                      />
                                    )}
                                    <span className="text-xs font-bold text-slate-800 truncate">
                                      {buyerTeam?.name || p.soldToTeamName}
                                    </span>
                                  </div>
                                  <span className="text-xs font-black text-emerald-700 whitespace-nowrap ml-2">
                                    ₹{refundVal.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Refund to Purse vs Refund & Re-Auction */}
                          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Option 1: Standard Purse Refund */}
                            <button
                              type="button"
                              onClick={() => handleRefundPlayer(p, false)}
                              disabled={refundingId === p.id}
                              className="py-2 px-3 bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center space-x-1.5 transition-all shadow-xs disabled:opacity-50"
                              title="Credit purse back to team and return player to available roster"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{refundingId === p.id ? 'Refunding...' : `Refund +₹${refundVal.toLocaleString('en-IN')}`}</span>
                            </button>

                            {/* Option 2: Refund & Bring Directly to Live Stage */}
                            <button
                              type="button"
                              onClick={() => handleRefundPlayer(p, true)}
                              disabled={refundingId === p.id}
                              className="py-2 px-3 bg-[#181E32] hover:bg-[#283254] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center space-x-1.5 transition-all shadow-xs disabled:opacity-50"
                              title="Credit purse back and immediately queue player for fresh live auction"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Refund & Re-Auction</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 4 TEAM NAMES & HIDDEN CODES */}
          {activeTab === 'team_codes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-playfair text-[#111827]">
                  Franchise Confidential Hidden Codes
                </h3>
                <p className="text-xs text-slate-500">
                  Each franchise owner must enter their confidential passcode to lock in and submit auction offers:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* RCD */}
                <div className="bg-[#FAF7F0] border-2 border-red-500 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black font-playfair text-red-700">RCD</span>
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 font-bold">FRANCHISE 1</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827]">Royal Challengers Durgapur</h4>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold block">CONFIDENTIAL CODE</span>
                    <span className="font-mono text-base font-black text-red-600 tracking-wider">RCD367@</span>
                  </div>
                </div>

                {/* DSK */}
                <div className="bg-[#FAF7F0] border-2 border-amber-500 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black font-playfair text-amber-700">DSK</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 font-bold">FRANCHISE 2</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827]">Durgapur Super Kings</h4>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold block">CONFIDENTIAL CODE</span>
                    <span className="font-mono text-base font-black text-amber-700 tracking-wider">DSK387@</span>
                  </div>
                </div>

                {/* DKR */}
                <div className="bg-[#FAF7F0] border-2 border-purple-500 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black font-playfair text-purple-700">DKR</span>
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 font-bold">FRANCHISE 3</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827]">Durgapur Knight Riders</h4>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold block">CONFIDENTIAL CODE</span>
                    <span className="font-mono text-base font-black text-purple-700 tracking-wider">DKR358@</span>
                  </div>
                </div>

                {/* DR */}
                <div className="bg-[#FAF7F0] border-2 border-blue-500 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black font-playfair text-blue-700">DR</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-bold">FRANCHISE 4</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827]">Durgapur Royals</h4>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold block">CONFIDENTIAL CODE</span>
                    <span className="font-mono text-base font-black text-blue-700 tracking-wider">DRR360@</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
