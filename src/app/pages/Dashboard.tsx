import { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  FileCheck,
  ChevronRight,
  BookOpen,
  Trophy,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import TiltCard from '../components/TiltCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 65 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 90 },
  { name: 'Sat', value: 70 },
  { name: 'Sun', value: 85 },
];

const skillData = [
  { name: 'React', level: 95, color: '#3b82f6' },
  { name: 'TypeScript', level: 88, color: '#60a5fa' },
  { name: 'Next.js', level: 82, color: '#2563eb' },
  { name: 'Tailwind CSS', level: 90, color: '#0ea5e9' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setToast('AI analysis refreshed!');
      setTimeout(() => setToast(''), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Banner Image Section */}
      <div className="relative w-full h-[200px] rounded-3xl overflow-hidden mb-8 border border-slate-800">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Dashboard Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute bottom-6 left-8">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 mb-3 inline-block">PRO ACCOUNT</span>
          <h1 className="text-3xl font-bold text-slate-100">Welcome back, Hafsa</h1>
          <p className="text-slate-400 mt-1">Here is your daily career growth summary.</p>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Overview</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Last updated: Today, 2:45 PM</span>
          <button onClick={handleRefresh} disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-500 disabled:opacity-70 transition-all flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'AI Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Job Match', value: '92%', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Skills Analyzed', value: '24', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Resume Score', value: '8.5', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Rank', value: 'Top 5%', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <TiltCard key={i}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card group cursor-pointer h-full"
            >
              <div className="flex items-center justify-between mb-4" style={{ transform: "translateZ(20px)" }}>
                <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">+12%</span>
              </div>
              <p className="text-slate-400 text-sm font-medium" style={{ transform: "translateZ(10px)" }}>{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1" style={{ transform: "translateZ(30px)" }}>{stat.value}</h3>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <TiltCard className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-8" style={{ transform: "translateZ(20px)" }}>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Skill Growth Trend</h3>
              <p className="text-sm text-slate-400">Your performance over the last 7 days</p>
            </div>
            <select className="bg-slate-800 border-none text-sm font-semibold text-slate-300 rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full" style={{ transform: "translateZ(30px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '16px', 
                    border: '1px solid #334155', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                    color: '#f1f5f9'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>

        {/* Skill Gap Section */}
        <TiltCard className="card">
          <h3 className="text-lg font-bold text-slate-100 mb-6" style={{ transform: "translateZ(20px)" }}>Skill Analysis</h3>
          <div className="space-y-6" style={{ transform: "translateZ(30px)" }}>
            {skillData.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">{skill.name}</span>
                  <span className="text-sm font-bold text-primary">{skill.level}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-primary/10 rounded-2xl border border-primary/20" style={{ transform: "translateZ(40px)" }}>
            <div className="flex gap-3">
              <div className="p-2 bg-primary rounded-lg h-fit shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">AI Recommendation</p>
                <p className="text-sm text-slate-300 mt-1">Focus on <span className="font-bold text-slate-100">Advanced React Patterns</span> to reach your target job match.</p>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Bottom Section - Courses and Roadmap Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Courses */}
        <TiltCard className="card">
          <div className="flex items-center justify-between mb-6" style={{ transform: "translateZ(20px)" }}>
            <h3 className="text-lg font-bold text-slate-100">Recommended Courses</h3>
            <button onClick={() => navigate('/courses')} className="text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4" style={{ transform: "translateZ(30px)" }}>
            {[
              { title: 'Advanced System Architecture', platform: 'Coursera', time: '12h 30m', level: 'Intermediate', icon: BookOpen },
              { title: 'Product Leadership Masterclass', platform: 'LinkedIn Learning', time: '8h 15m', level: 'Advanced', icon: TrendingUp },
            ].map((course, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => navigate('/courses')}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-inner">
                  <course.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{course.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{course.platform}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span className="text-xs text-slate-400">{course.time}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{course.level}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </TiltCard>

        {/* Learning Roadmap Timeline Preview */}
        <TiltCard className="card">
          <h3 className="text-lg font-bold text-slate-100 mb-6" style={{ transform: "translateZ(20px)" }}>Career Roadmap</h3>
          <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800" style={{ transform: "translateZ(30px)" }}>
            {[
              { title: 'Current Role: UI Designer', status: 'completed', date: 'Now' },
              { title: 'Master Frontend Architecture', status: 'active', date: 'Q3 2026' },
              { title: 'Target: Product Designer', status: 'pending', date: '2027' },
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                className="flex gap-6 relative group"
              >
                <div className={`w-[35px] h-[35px] rounded-full border-4 border-slate-900 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 ${
                  step.status === 'completed' ? 'bg-emerald-500' : 
                  step.status === 'active' ? 'bg-blue-500' : 'bg-slate-800'
                }`}>
                  {step.status === 'completed' && <FileCheck className="w-3 h-3 text-white" />}
                  {step.status === 'active' && <Zap className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'}`}>{step.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{step.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={() => navigate('/roadmap')} className="w-full mt-8 py-3 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 hover:text-white transition-all border border-slate-700 shadow-lg hover:-translate-y-1" style={{ transform: "translateZ(40px)" }}>
            Open Full Roadmap
          </button>
        </TiltCard>
      </div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-2xl z-50 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
