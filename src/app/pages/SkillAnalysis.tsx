import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Zap, Target, TrendingUp, AlertTriangle, CheckCircle2, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import TiltCard from '../components/TiltCard';

export default function SkillAnalysis() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('skillbridge_analysis');
    if (saved) {
      try {
        setAnalysisData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse analysis data");
      }
    }
  }, []);

  // Default fallback data if no analysis exists
  const defaultSkills = [
    { name: 'React & Hooks',      current: 92, required: 95, color: '#3b82f6' },
    { name: 'TypeScript',         current: 78, required: 90, color: '#6366f1' },
    { name: 'UI/UX Design',       current: 95, required: 90, color: '#10b981' },
    { name: 'Framer Motion',      current: 72, required: 80, color: '#f59e0b' },
    { name: 'Node.js & APIs',     current: 55, required: 75, color: '#ef4444' },
    { name: 'AI/ML Fundamentals', current: 48, required: 70, color: '#8b5cf6' },
    { name: 'System Design',      current: 60, required: 80, color: '#ec4899' },
    { name: 'Testing (Jest)',      current: 50, required: 70, color: '#14b8a6' },
  ];

  // Process data from API if available
  let skills = defaultSkills;
  let recommendations = [
    { course: 'Advanced TypeScript Patterns', match: '98%', priority: 'High', icon: BookOpen },
    { course: 'Node.js Microservices', match: '94%', priority: 'High', icon: BookOpen },
    { course: 'AI Agents with LangChain', match: '90%', priority: 'Medium', icon: Sparkles },
  ];
  let overallScore = 74;

  if (analysisData) {
    overallScore = analysisData.match_score || 74;
    
    // Map missing skills to UI format
    if (analysisData.missing_skills && analysisData.missing_skills.length > 0) {
      skills = analysisData.missing_skills.map((s: string) => ({
        name: s, current: Math.floor(Math.random() * 40) + 20, required: 80, color: '#ef4444'
      }));
    }
    // Add resume skills
    if (analysisData.resume_skills && analysisData.resume_skills.length > 0) {
      const existing = analysisData.resume_skills.map((s: string) => ({
        name: s, current: Math.floor(Math.random() * 20) + 80, required: 80, color: '#10b981'
      }));
      skills = [...existing, ...skills];
    }
    
    if (analysisData.recommendations && analysisData.recommendations.length > 0) {
      recommendations = analysisData.recommendations.map((r: any) => ({
        course: r.course, match: '95%', priority: r.priority || 'High', icon: BookOpen
      }));
    }
  }

  const gaps = skills.filter(s => s.current < s.required);
  const strengths = skills.filter(s => s.current >= s.required);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Skill Analysis</h1>
          <p className="text-slate-400 mt-2">AI-powered breakdown of your current skills vs. market demand.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{strengths.length} Strengths</span>
          </div>
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">{gaps.length} Gaps</span>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Overall Score', value: `${overallScore}%`, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10', sub: 'vs. market average' },
          { label: 'Job Readiness', value: '82%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: 'Senior Product Designer' },
          { label: 'Skill Velocity', value: '+12%', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: 'growth this month' },
        ].map((stat, i) => (
          <TiltCard key={i}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card h-full flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.bg} flex-shrink-0`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {/* Skill Bars */}
      <TiltCard className="card">
        <h3 className="text-lg font-bold text-slate-100 mb-2">Skills vs. Market Demand</h3>
        <p className="text-sm text-slate-500 mb-8">Blue bar = your level · Dashed line = required level</p>
        <div className="space-y-6">
          {skills.map((skill, i) => {
            const gap = skill.required - skill.current;
            const isGap = gap > 0;
            return (
              <motion.div key={skill.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-300">{skill.name}</span>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span style={{ color: skill.color }}>{skill.current}%</span>
                    {isGap
                      ? <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">-{gap}% gap</span>
                      : <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">✓ Met</span>
                    }
                  </div>
                </div>
                <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${skill.current}%` }}
                    transition={{ duration: 1, delay: i * 0.07 }}
                    className="h-full rounded-full" style={{ backgroundColor: skill.color }} />
                  {/* Required marker */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white/30 border-l border-dashed border-white/40"
                    style={{ left: `${skill.required}%` }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </TiltCard>

      {/* Gap Analysis + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gaps */}
        <TiltCard className="card">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Priority Skill Gaps
          </h3>
          <div className="space-y-4">
            {gaps.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-red-400 bg-red-500/10 flex-shrink-0">
                  -{skill.required - skill.current}%
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">{skill.name}</p>
                  <p className="text-xs text-slate-500">{skill.current}% current → {skill.required}% needed</p>
                </div>
              </motion.div>
            ))}
          </div>
        </TiltCard>

        {/* AI Recommendations */}
        <TiltCard className="card">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" /> AI Course Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/courses')}
                className="flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl hover:bg-blue-600/10 hover:border-blue-500/20 cursor-pointer transition-all group">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <rec.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{rec.course}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${rec.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-500">{rec.match} match</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </motion.div>
            ))}
          </div>
          <button onClick={() => navigate('/courses')}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
            View All Courses
          </button>
        </TiltCard>
      </div>
    </div>
  );
}
