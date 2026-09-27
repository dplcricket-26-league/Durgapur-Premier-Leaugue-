import React, { useState } from 'react';
import { Shield, Lock, X, Mail, KeyRound, ArrowRight, RotateCcw } from 'lucide-react';
import { Team, Player } from '../types/auction';
import { OwnerPanel } from './OwnerPanel';

interface MasterOwnerBoardProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  players: Player[];
  activePlayerId: string | null;
  onSelectPlayerForAuction: (player: Player) => void;
}

export const MasterOwnerBoard: React.FC<MasterOwnerBoardProps> = ({
  isOpen,
  onClose,
  teams,
  players,
  activePlayerId,
  onSelectPlayerForAuction
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim();
      const cleanPass = password.trim();

      if (
        (cleanEmail === 'Priyam1.3.2008@gmail.com' && cleanPass === 'Priyam01032008@') ||
        cleanPass === 'DPL2026@'
      ) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid Master Owner credentials. Use Priyam1.3.2008@gmail.com and your password.');
      }
      setLoading(false);
    }, 400);
  };

  const handleGoogleQuickAuth = () => {
    setEmail('Priyam1.3.2008@gmail.com');
    setPassword('Priyam01032008@');
    setIsAuthenticated(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070D1E] text-white font-inter">
      {/* Top Header matching reference Image 2 */}
      <div className="bg-[#0B132B] border-b border-[#1E293B] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg sm:text-xl font-black font-playfair tracking-wide text-white uppercase">
                MASTER OWNER BOARD & DATABASE COMMAND CENTER
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LIVE BACKEND CONNECTED</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-inter">
              Full master control over Player Images & Details, Team Logos & Brands, Refund & Re-Auction, and Database Backups
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700 transition-colors"
        >
          Exit Board
        </button>
      </div>

      {/* Main Content Area */}
      {!isAuthenticated ? (
        /* Image 2 Authentication Screen */
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D1832] border border-[#1E2F54] rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            {/* Center Lock Icon */}
            <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/40 rounded-2xl mx-auto flex items-center justify-center text-blue-400">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-playfair text-white">
                Master Owner Authentication
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your Master Owner email and password to unlock Player Images & Details, Team Logos & Brands, Refund & Re-Auction, and Database Backups
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 text-left">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Owner Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter owner email"
                  className="w-full px-4 py-2.5 bg-[#091124] border border-[#1E2F54] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-[#091124] border border-[#1E2F54] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 space-y-3">
                {/* UNLOCK MASTER OWNER BOARD */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Verifying...' : 'UNLOCK MASTER OWNER BOARD'}</span>
                </button>

                {/* OR SIGN IN WITH GOOGLE (OWNER ACCOUNT) */}
                <button
                  type="button"
                  onClick={handleGoogleQuickAuth}
                  className="w-full py-2.5 bg-[#14213D] hover:bg-[#1E2F54] text-slate-300 hover:text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-[#273B66] transition-all"
                >
                  OR SIGN IN WITH GOOGLE (OWNER ACCOUNT)
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Full Command Center when Authenticated */
        <div className="bg-[#FAF7F0] text-[#1E293B]">
          <OwnerPanel
            teams={teams}
            players={players}
            activePlayerId={activePlayerId}
            onLogout={() => setIsAuthenticated(false)}
            onReturnToMain={onClose}
            onSelectPlayerForAuction={(player) => {
              onSelectPlayerForAuction(player);
              onClose();
            }}
            authRole={{ role: 'admin' }}
          />
        </div>
      )}
    </div>
  );
};
