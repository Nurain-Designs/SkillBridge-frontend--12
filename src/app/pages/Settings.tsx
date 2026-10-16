import { useState } from 'react';
import {
  User, Lock, Bell, Shield, Eye, EyeOff, Moon, Globe,
  CreditCard, LogOut, ChevronRight, Sparkles, ChevronDown,
  Check, AlertTriangle, Plus, Trash2, Sun, Wifi, WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { DEMO_MODE } from '../demo';

/* ─── tiny reusable toggle ─── */
const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-12 h-7 rounded-full relative transition-all duration-300 flex-shrink-0 ${value ? 'bg-blue-600' : 'bg-slate-700'}`}
  >
    <motion.div animate={{ x: value ? 22 : 3 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md" />
  </button>
);

/* ─── expandable panel wrapper ─── */
const Panel = ({ open, children }: { open: boolean; children: React.ReactNode }) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 space-y-4">
          {children}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Settings() {
  const navigate = useNavigate();

  /* ── global state ── */
  const [darkMode, setDarkMode] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [language, setLanguage] = useState('English');
  const [toast, setToast] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const toggle = (key: string) => setExpanded(prev => (prev === key ? null : key));

  /* ── Security ── */
  const [passwords, setPasswords] = useState({ old: '', new1: '', new2: '' });
  const [twoFA, setTwoFA] = useState(false);
  const handleChangePassword = () => {
    if (!passwords.old || !passwords.new1) return showToast('Please fill all fields');
    if (passwords.new1 !== passwords.new2) return showToast('Passwords do not match');
    setPasswords({ old: '', new1: '', new2: '' });
    showToast('Password updated successfully!');
  };

  /* ── Notifications ── */
  const [notifs, setNotifs] = useState({ email: true, push: false, digest: true, reminders: true });
  const toggleNotif = (k: keyof typeof notifs) => setNotifs(p => ({ ...p, [k]: !p[k] }));

  /* ── Privacy ── */
  const [privacy, setPrivacy] = useState({ analytics: true, marketing: false, thirdParty: false });
  const togglePrivacy = (k: keyof typeof privacy) => setPrivacy(p => ({ ...p, [k]: !p[k] }));

  /* ── Payment ── */
  const [cards] = useState([{ last4: '4242', brand: 'Visa', exp: '12/27' }]);
  const [showAddCard, setShowAddCard] = useState(false);

  const langs = ['English', 'Spanish', 'French', 'German', 'Hindi'];

  /* ─────────── ROW RENDERER ─────────── */
  const Row = ({
    id, icon: Icon, color, label, desc, badge, right, children
  }: {
    id: string; icon: any; color: string; label: string; desc: string;
    badge?: string; right?: React.ReactNode; children?: React.ReactNode;
  }) => {
    const isOpen = expanded === id;
    const hasPanel = !!children;
    return (
      <div>
        <div
          onClick={() => {
            if (id === 'profile') { navigate('/profile'); return; }
            if (hasPanel) toggle(id);
          }}
          className="group p-5 flex items-center justify-between hover:bg-slate-800/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <div className={`p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-100 font-bold flex items-center gap-2 text-sm">
                {label}
                {badge && <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-lg">{badge}</span>}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {right}
            {hasPanel
              ? <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              : <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />}
          </div>
        </div>
        {children && <Panel open={isOpen}>{children}</Panel>}
      </div>
    );
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/60 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all";
  const labelCls = "text-[11px] font-bold text-slate-500 uppercase tracking-widest";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage your account preferences and system settings.</p>
        </div>
        <button onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-2xl font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* ─── GENERAL ─── */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">General</h3>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] overflow-hidden divide-y divide-slate-800/50">

          {/* Account Profile */}
          <Row id="profile" icon={User} color="text-blue-400" label="Account Profile" desc="Update your personal info and bio" />

          {/* Security */}
          <Row id="security" icon={Lock} color="text-emerald-400" label="Security" desc="Password, 2FA, and login history">
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Change Password</p>
              <div className="space-y-3">
                <div><label className={labelCls}>Current Password</label>
                  <input type="password" placeholder="••••••••" value={passwords.old}
                    onChange={e => setPasswords(p => ({ ...p, old: e.target.value }))} className={`${inputCls} mt-1`} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>New Password</label>
                    <input type="password" placeholder="••••••••" value={passwords.new1}
                      onChange={e => setPasswords(p => ({ ...p, new1: e.target.value }))} className={`${inputCls} mt-1`} /></div>
                  <div><label className={labelCls}>Confirm</label>
                    <input type="password" placeholder="••••••••" value={passwords.new2}
                      onChange={e => setPasswords(p => ({ ...p, new2: e.target.value }))} className={`${inputCls} mt-1`} /></div>
                </div>
                <button onClick={handleChangePassword}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all flex items-center gap-2">
                  <Check className="w-4 h-4" /> Update Password
                </button>
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mt-0.5">Secure your account with TOTP or SMS</p>
                </div>
                <Toggle value={twoFA} onChange={() => { setTwoFA(p => !p); showToast(twoFA ? '2FA disabled' : '2FA enabled!'); }} />
              </div>
            </div>
          </Row>

          {/* Privacy */}
          <Row id="privacy" icon={Shield} color="text-amber-400" label="Privacy" desc="Manage your data and visibility">
            <div className="space-y-4">
              {[
                { key: 'analytics' as const, label: 'Usage Analytics', desc: 'Help us improve with anonymous usage data' },
                { key: 'marketing' as const, label: 'Marketing Emails', desc: 'Receive promotional content and offers' },
                { key: 'thirdParty' as const, label: 'Third-Party Sharing', desc: 'Share data with partner platforms' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-bold text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Toggle value={privacy[item.key]} onChange={() => { togglePrivacy(item.key); showToast(`${item.label} ${!privacy[item.key] ? 'enabled' : 'disabled'}`); }} />
                </div>
              ))}
              <div className="pt-3 border-t border-slate-800/60 flex flex-wrap gap-3">
                <button onClick={() => showToast('Download started — check your email!')}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700">
                  Download My Data
                </button>
                <button onClick={() => showToast('Account deletion email sent. Check your inbox.')}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                </button>
              </div>
            </div>
          </Row>
        </div>
      </div>

      {/* ─── PREFERENCES ─── */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Preferences</h3>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] overflow-hidden divide-y divide-slate-800/50">

          {/* Notifications */}
          <Row id="notifications" icon={Bell} color="text-pink-400" label="Notifications" desc="Configure email and push alerts">
            <div className="space-y-4">
              {[
                { key: 'email' as const, label: 'Email Alerts', desc: 'Course updates and skill reports' },
                { key: 'push' as const, label: 'Push Notifications', desc: 'Real-time browser notifications' },
                { key: 'digest' as const, label: 'Weekly Digest', desc: 'Sunday summary of your progress' },
                { key: 'reminders' as const, label: 'Course Reminders', desc: 'Nudges when you fall behind' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-bold text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Toggle value={notifs[item.key]} onChange={() => { toggleNotif(item.key); showToast(`${item.label} ${!notifs[item.key] ? 'on' : 'off'}`); }} />
                </div>
              ))}
            </div>
          </Row>

          {/* Appearance */}
          <Row id="appearance" icon={darkMode ? Moon : Sun} color="text-indigo-400" label="Appearance" desc="Dark mode and theme settings"
            right={<Toggle value={darkMode} onChange={() => { setDarkMode(p => !p); showToast(darkMode ? 'Light mode enabled' : 'Dark mode enabled'); }} />}>
            <div className="grid grid-cols-2 gap-3">
              {['Dark', 'Light'].map(theme => (
                <button key={theme} onClick={() => { setDarkMode(theme === 'Dark'); showToast(`${theme} mode enabled`); }}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center gap-2
                    ${(theme === 'Dark') === darkMode ? 'bg-blue-600/15 border-blue-500/50 text-blue-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}>
                  {theme === 'Dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} {theme}
                  {(theme === 'Dark') === darkMode && <Check className="w-3.5 h-3.5 ml-auto" />}
                </button>
              ))}
            </div>
          </Row>

          {/* Language */}
          <Row id="language" icon={Globe} color="text-cyan-400" label="Language" desc="Set your primary interface language"
            right={<span className="text-sm font-bold text-slate-400">{language}</span>}>
            <div className="flex flex-wrap gap-2">
              {langs.map(lang => (
                <button key={lang} onClick={() => { setLanguage(lang); showToast(`Language set to ${lang}`); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border
                    ${language === lang ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}>
                  {lang} {language === lang && '✓'}
                </button>
              ))}
            </div>
          </Row>
        </div>
      </div>

      {/* ─── BILLING ─── */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Billing</h3>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] overflow-hidden divide-y divide-slate-800/50">

          {/* Subscription */}
          <Row id="subscription" icon={Sparkles} color="text-purple-400" label="Subscription" desc="Manage your Pro plan features" badge="Pro">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-2xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-blue-400">SkillBridge Pro</span>
                  <span className="text-xs font-bold text-slate-400">$29/mo</span>
                </div>
                <p className="text-xs text-slate-400">Renews on July 1, 2026 · All AI features included</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => showToast('Subscription cancelled. Active until July 1.')}
                    className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all">
                    Cancel Plan
                  </button>
                  <button onClick={() => showToast('Redirecting to billing portal...')}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-all">
                    Manage Billing
                  </button>
                </div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">Enterprise Plan</p>
                  <p className="text-xs text-slate-500">Team seats, SSO, custom AI models</p>
                </div>
                <button onClick={() => showToast('Sales team will contact you!')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </Row>

          {/* Payment Methods */}
          <Row id="payment" icon={CreditCard} color="text-slate-400" label="Payment Methods" desc="Update your credit card details">
            <div className="space-y-3">
              {cards.map((card, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{card.brand} •••• {card.last4}</p>
                      <p className="text-xs text-slate-500">Expires {card.exp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Default</span>
                    <button onClick={() => showToast('Card removed')} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {showAddCard && (
                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-3">
                  <input type="text" placeholder="Card number" maxLength={19} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM / YY" className={inputCls} />
                    <input type="text" placeholder="CVC" className={inputCls} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddCard(false); showToast('Card added successfully!'); }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all">
                      Add Card
                    </button>
                    <button onClick={() => setShowAddCard(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all border border-slate-700">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {!showAddCard && (
                <button onClick={() => setShowAddCard(true)}
                  className="w-full py-3 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 text-sm font-bold hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Card
                </button>
              )}
            </div>
          </Row>
        </div>
      </div>

      {/* ─── Profile Visibility ─── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className={`p-7 bg-slate-900/60 backdrop-blur-xl border rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-500
          ${isPublic ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${isPublic ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <AnimatePresence mode="wait">
              <motion.div key={isPublic ? 'eye' : 'eye-off'} initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.25 }}>
                {isPublic ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <h4 className="text-slate-100 font-bold">Profile Visibility</h4>
            <div className="text-sm text-slate-500 mt-1">
              Your profile is currently{' '}
              <span className={`font-bold text-xs px-2 py-0.5 rounded-md ${isPublic ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">{isPublic ? 'Go Private' : 'Go Public'}</span>
          <button onClick={() => { setIsPublic(p => !p); showToast(`Profile set to ${!isPublic ? 'Public' : 'Private'}!`); }}
            className={`w-14 h-8 rounded-full relative transition-all duration-500 flex-shrink-0 ${isPublic ? 'bg-emerald-500' : 'bg-slate-700'}`}>
            <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-xl flex items-center justify-center"
              style={{ x: isPublic ? 24 : 2 }}>
              <div className={`w-2 h-2 rounded-full ${isPublic ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Backend Status */}
      <div className="flex items-center gap-3 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
        <div className="p-2 bg-amber-500/10 rounded-xl"><WifiOff className="w-4 h-4 text-amber-400" /></div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-200">AI Backend Status</p>
          <p className="text-xs text-slate-500">Start <code className="text-amber-400">python api_server.py</code> to enable live AI analysis</p>
        </div>
        <button onClick={() => { if (DEMO_MODE) { showToast('Demo mode — no AI backend is connected to this public demo'); return; } fetch('http://localhost:5000/api/health').then(() => showToast('✅ Backend connected!')).catch(() => showToast('❌ Backend offline — start api_server.py')); }}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5" /> Check Status
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 border border-slate-700 text-white rounded-2xl font-bold shadow-2xl z-50 flex items-center gap-2 text-sm">
            {toast.startsWith('✅') ? <Check className="w-4 h-4 text-emerald-400" /> :
              toast.startsWith('❌') ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                <Sparkles className="w-4 h-4 text-blue-400" />}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
