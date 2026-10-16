import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Mail, Lock, Chrome, ArrowRight, Sparkles, Play, Pause, UserPlus, LogIn, Loader2, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import AnimatedBackground from '../components/AnimatedBackground';
import { BASE, DEMO_MODE } from '../demo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const mockAccounts = [
    { email: 'sameer.designer@gmail.com', name: 'Sameer Designer', avatar: 'SD' },
    { email: 'hafsa.dev@gmail.com', name: 'Hafsa Developer', avatar: 'HD' },
    { email: 'admin.skillbridge@gmail.com', name: 'Admin Account', avatar: 'AS' },
  ];

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleGoogleClick = () => {
    setShowAccountPicker(true);
  };

  const selectAccount = (email: string) => {
    setSelectedAccount(email);
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowAccountPicker(false);
      navigate('/dashboard');
    }, 2000);
  };

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden perspective-[2000px]">
      <AnimatedBackground />
      
      {/* Google Account Picker Modal */}
      <AnimatePresence>
        {showAccountPicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Chrome className="w-6 h-6 text-red-500" />
                    <span className="text-xl font-bold text-slate-900">Sign in with Google</span>
                  </div>
                  <button 
                    onClick={() => setShowAccountPicker(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  {mockAccounts.map((account) => (
                    <button
                      key={account.email}
                      disabled={isConnecting}
                      onClick={() => selectAccount(account.email)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                        selectedAccount === account.email 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${
                        account.avatar === 'SD' ? 'bg-indigo-500' : account.avatar === 'HD' ? 'bg-pink-500' : 'bg-slate-700'
                      }`}>
                        {account.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{account.name}</p>
                        <p className="text-sm text-slate-500">{account.email}</p>
                      </div>
                      {selectedAccount === account.email ? (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          {isConnecting ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Check className="w-4 h-4 text-white" />}
                        </div>
                      ) : (
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      )}
                    </button>
                  ))}
                </div>

                <button className="w-full mt-6 py-4 text-slate-600 font-semibold hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Use another account
                </button>
              </div>
              <div className="bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-400">
                  To continue, Google will share your name, email address, language preference, and profile picture with <span className="font-bold">SkillBridge</span>.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 max-w-6xl w-full bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row min-h-[750px] border border-slate-700/50">
        
        {/* Left Side - 3D Tilt Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="w-full md:w-1/2 p-12 flex flex-col justify-center relative z-30"
        >
          {/* Content wrapper */}
          <div style={{ transformStyle: "preserve-3d" }}>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.4)]">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-100 leading-tight tracking-tight">
                SkillBridge<br/>
                <span className="text-blue-400 text-lg font-semibold">Agentic AI Career Advisor & Skill Gap Analyser</span>
              </h1>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'login'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-10"
              >
                <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-400">
                  {isSignUp ? 'Start your journey with precision AI.' : 'Your immersive career journey starts here.'}
                </p>
              </motion.div>
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <AnimatePresence>
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 group overflow-hidden"
                  >
                    <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                    <div className="relative">
                      <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        required={isSignUp}
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/60 backdrop-blur-md border-b-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-inner hover:bg-slate-900/80"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/60 backdrop-blur-md border-b-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-inner hover:bg-slate-900/80"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/60 backdrop-blur-md border-b-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-inner hover:bg-slate-900/80"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 shadow-sm" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit"
                disabled={isConnecting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:translate-y-0 transition-all flex items-center justify-center gap-2 group relative z-50 overflow-hidden"
              >
                {isConnecting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Initialize Account' : 'Enter Platform'}
                    {isSignUp ? <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                  </>
                )}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/40 backdrop-blur-sm text-slate-500 uppercase tracking-wider text-xs font-bold drop-shadow-md">Or continue with</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleClick}
                disabled={isConnecting}
                className="w-full py-4 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-slate-700 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
              </button>
            </form>

            {DEMO_MODE && (
              <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-center">
                <p className="text-sm text-slate-300">
                  This is a public demo. Sign-in isn’t real, and no account is created.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
                >
                  Explore the demo
                </button>
              </div>
            )}

            <p className="mt-8 text-center text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 font-bold hover:text-blue-300 hover:underline"
              >
                {isSignUp ? 'Log in' : 'Create an account'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Stoppable 3D Animated Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex w-1/2 bg-slate-950/60 items-center justify-center p-12 relative overflow-hidden backdrop-blur-md border-l border-slate-800/50"
        >
          {/* 3D Glowing Orbs in background */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/30 rounded-full -mr-48 -mt-48 blur-[100px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full -ml-48 -mb-48 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 w-full max-w-lg group perspective-[1000px]">
            {/* Play/Pause Control Overlay */}
            <div className="absolute top-4 right-4 z-40">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-full border border-slate-700/50 text-white hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center"
                title={isPlaying ? "Pause 3D Video Animation" : "Play 3D Video Animation"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
            </div>

            <motion.img 
              src={`${BASE}ai-career_advisor.png`} 
              alt="AI Career Advisor" 
              className="w-full h-auto drop-shadow-[0_30px_60px_rgba(59,130,246,0.4)] rounded-3xl object-cover border-4 border-slate-800/50 cursor-grab active:cursor-grabbing relative z-20"
              drag
              dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
              dragElastic={0.4}
              whileHover={{ scale: 1.05 }}
              animate={isPlaying ? { 
                y: [0, -20, 0],
                rotateY: [0, 15, -15, 0],
                rotateX: [0, 5, -5, 0]
              } : { 
                y: 0, 
                rotateY: 0,
                rotateX: 0
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ transformStyle: "preserve-3d" }}
            />
            
            <div className="mt-12 space-y-4">
              <motion.div 
                animate={isPlaying ? { y: [0, -10, 0] } : { y: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-700 flex items-center gap-4 relative z-30"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">3D Neural Link Active</p>
                  <p className="text-xs text-slate-400">Processing career pathways in real-time</p>
                </div>
              </motion.div>

              <motion.div 
                animate={isPlaying ? { y: [0, -10, 0] } : { y: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-700 flex items-center gap-4 ml-8 relative z-30"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Video Simulation Running</p>
                  <p className="text-xs text-slate-400">Interactive 3D mode enabled</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
