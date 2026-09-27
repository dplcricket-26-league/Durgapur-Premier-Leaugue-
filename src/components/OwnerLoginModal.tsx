import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldAlert, ArrowRight, ShieldCheck, Key, ArrowLeft } from 'lucide-react';
import { TEAM_SECRET_CODES } from '../data/initialData';
import { Team } from '../types/auction';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authData: { role: 'admin' | 'team'; teamShort?: string }) => void;
  teams?: Team[];
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  teams = [] 
}) => {
  const [loginMethod, setLoginMethod] = useState<'secret_code' | 'admin_creds'>('secret_code');
  const [secretCode, setSecretCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Login via Franchise Secret Hidden Code (RCD: RCD367@, DSK: DSK387@, DKR: DKR358@, DR: DRR360@)
  const handleSecretCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const code = secretCode.trim();

    setTimeout(() => {
      // Check Master Committee Code
      if (code === 'DPL2026@' || code === 'Priyam01032008@') {
        onSuccess({ role: 'admin' });
        onClose();
        setLoading(false);
        return;
      }

      // Match against 4 Official Teams: RCD367@, DSK387@, DKR358@, DRR360@
      let matchedShort: string | null = null;
      for (const [short, pass] of Object.entries(TEAM_SECRET_CODES)) {
        if (pass === code || pass.toUpperCase() === code.toUpperCase()) {
          matchedShort = short;
          break;
        }
      }

      if (matchedShort) {
        onSuccess({ role: 'team', teamShort: matchedShort });
        onClose();
      } else {
        setError('Invalid hidden code. Enter your 4-team confidential code (e.g. RCD is RCD367@, DSK is DSK387@, DKR is DKR358@, DR is DRR360@)');
      }
      setLoading(false);
    }, 350);
  };

  // Handle Committee Admin Email & Password
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim();
      const cleanPass = password.trim();

      if (cleanEmail === 'Priyam1.3.2008@gmail.com' && cleanPass === 'Priyam01032008@') {
        onSuccess({ role: 'admin' });
        onClose();
      } else {
        setError('Invalid owner credentials. Please check your committee email and password.');
      }
      setLoading(false);
    }, 350);
  };

  const handleSelectCode = (code: string) => {
    setSecretCode(code);
    setError(null);
  };

  const handleAutofillAdmin = () => {
    setEmail('Priyam1.3.2008@gmail.com');
    setPassword('Priyam01032008@');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 font-inter">
      <div 
        className="w-full max-w-lg bg-[#FAF7F0] border-2 border-[#D4AF37] shadow-2xl overflow-hidden transform transition-all text-[#1E293B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#181E32] text-white px-6 py-5 border-b border-[#D4AF37] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37] text-[#181E32]">
              <Lock className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block">
                DURGAPUR PREMIER LEAGUE 2026
              </span>
              <h2 className="text-lg sm:text-xl font-black font-playfair tracking-wide text-white uppercase leading-tight">
                SEPARATE BACKEND PANEL LOGIN
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection: Hidden Code vs Admin Email */}
        <div className="flex border-b border-[#E2E8F0] bg-white text-xs font-bold font-inter">
          <button
            type="button"
            onClick={() => { setLoginMethod('secret_code'); setError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 transition-all border-b-2 ${
              loginMethod === 'secret_code'
                ? 'border-[#D4AF37] text-[#181E32] bg-[#FAF7F0]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4 text-[#D4AF37]" />
            <span>FRANCHISE HIDDEN CODE</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('admin_creds'); setError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 transition-all border-b-2 ${
              loginMethod === 'admin_creds'
                ? 'border-[#D4AF37] text-[#181E32] bg-[#FAF7F0]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>COMMITTEE ADMIN</span>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-xs text-red-700 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* METHOD 1: Franchise Secret Hidden Code */}
          {loginMethod === 'secret_code' && (
            <form onSubmit={handleSecretCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#181E32] mb-1 uppercase tracking-wider">
                  Enter Franchise Confidential Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="e.g. RCD367@, DSK387@, DKR358@, DRR360@"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] text-sm font-mono tracking-wider focus:outline-none focus:border-[#181E32] text-slate-900"
                  />
                </div>
              </div>

              {/* 4 Team Quick-Fill Chips */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Official 4 Teams & Hidden Codes:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectCode('RCD367@')}
                    className="p-2 border border-red-300 bg-red-50/50 hover:bg-red-100/60 text-left transition-colors"
                  >
                    <div className="font-bold text-red-800">RCD</div>
                    <div className="text-[10px] text-red-600 font-mono">Code: RCD367@</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCode('DSK387@')}
                    className="p-2 border border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 text-left transition-colors"
                  >
                    <div className="font-bold text-amber-800">DSK</div>
                    <div className="text-[10px] text-amber-700 font-mono">Code: DSK387@</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCode('DKR358@')}
                    className="p-2 border border-purple-300 bg-purple-50/50 hover:bg-purple-100/60 text-left transition-colors"
                  >
                    <div className="font-bold text-purple-800">DKR</div>
                    <div className="text-[10px] text-purple-700 font-mono">Code: DKR358@</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCode('DRR360@')}
                    className="p-2 border border-blue-300 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-colors"
                  >
                    <div className="font-bold text-blue-800">DR</div>
                    <div className="text-[10px] text-blue-700 font-mono">Code: DRR360@</div>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#181E32] hover:bg-[#283254] text-[#D4AF37] font-bold uppercase tracking-wider text-xs border border-[#D4AF37] transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Enter Separate Backend Panel'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* METHOD 2: Committee Admin Credentials */}
          {loginMethod === 'admin_creds' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#181E32] mb-1 uppercase tracking-wider">
                  Committee Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Priyam1.3.2008@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#181E32] text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181E32] mb-1 uppercase tracking-wider">
                  Admin Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#181E32] text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleAutofillAdmin}
                  className="text-blue-700 hover:text-blue-900 font-bold hover:underline"
                >
                  Autofill Committee Credentials
                </button>
                <span className="text-slate-500 font-mono text-[11px]">DPL 2026 Season</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#181E32] hover:bg-[#283254] text-[#D4AF37] font-bold uppercase tracking-wider text-xs border border-[#D4AF37] transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Verifying...' : 'Login as Committee Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F1ECE1] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-600">
          <button
            onClick={onClose}
            className="flex items-center space-x-1 font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Public Auction</span>
          </button>
          <span className="text-[11px] font-bold text-[#C69214]">DPL AUCTION 2026</span>
        </div>
      </div>
    </div>
  );
};
