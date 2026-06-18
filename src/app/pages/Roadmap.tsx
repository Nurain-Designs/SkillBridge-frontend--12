import { useState, useEffect } from 'react';
import {
  Flag,
  ChevronRight,
  Zap,
  Target,
  Map as MapIcon,
  Shield,
  Rocket,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import TiltCard from '../components/TiltCard';

// ------------------ ANIMATED COUNTER COMPONENT ------------------
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  delay?: number; // Delay in milliseconds before counting starts
}

const AnimatedCounter = ({ value, duration = 1500, decimals = 0, suffix = '', delay = 0 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const startTimeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function: easeOutQuad (starts fast, slows down beautifully)
        const easeProgress = progress * (2 - progress);
        const currentCount = easeProgress * value;

        setCount(currentCount);

        if (progress < 1) {
          frameId = window.requestAnimationFrame(step);
        }
      };
      frameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [value, duration, delay]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

// ------------------ MAIN ROADMAP COMPONENT ------------------
const Roadmap = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const steps = [
    {
      id: 1,
      title: 'Foundation & UI Fundamentals',
      description: 'Master the core principles of typography, color theory, and spatial systems.',
      status: 'completed',
      duration: 'Week 1-2',
      skills: ['Typography', 'Grid Systems', 'Color Theory'],
      icon: Target
    },
    {
      id: 2,
      title: 'Advanced Interaction Design',
      description: 'Learn complex state management and motion design with Framer Motion.',
      status: 'active',
      duration: 'Week 3-5',
      skills: ['Framer Motion', 'Micro-interactions', 'State Management'],
      icon: Zap
    },
    {
      id: 3,
      title: 'Agentic AI Workflows',
      description: 'Integrating LLMs and AI agents into user experiences and data flows.',
      status: 'pending',
      duration: 'Week 6-8',
      skills: ['LangChain', 'Prompt Engineering', 'AI UI'],
      icon: Rocket
    },
    {
      id: 4,
      title: 'Product Leadership',
      description: 'Scaling products and managing multi-disciplinary design systems.',
      status: 'locked',
      duration: 'Week 9-12',
      skills: ['Design Systems', 'Team Lead', 'Product Strategy'],
      icon: Shield
    }
  ];

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35, // Liquid staggered delay between steps
        delayChildren: 0.2
      }
    }
  } as const;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        duration: 0.8
      }
    }
  } as const;

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for liquid smooth drop
      }
    }
  } as const;

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  } as const;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header with entrance animation */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-full border border-blue-500/20 text-blue-400 text-sm font-bold">
          <MapIcon className="w-4 h-4" />
          PERSONALIZED PATHWAY
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">Your Career Growth Roadmap</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          This AI-generated roadmap is tailored to bridge your current skill gaps and help you reach your target role as a <span className="text-blue-400 font-bold">Senior Product Designer</span>.
        </p>
      </motion.div>

      {/* Roadmap Visualization */}
      <div className="relative pt-12">
        {/* Connection Line - Animates drawing down */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          style={{ originY: 0 }}
          className="absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-slate-800 hidden md:block"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Card Side */}
              <div className="flex-1 w-full">
                <TiltCard>
                  <div className={`p-8 rounded-[2.5rem] border transition-all ${step.status === 'active'
                      ? 'bg-slate-900/80 border-blue-500/50 shadow-[0_20px_50px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/20'
                      : 'bg-slate-900/40 border-slate-800'
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl ${step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          step.status === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{step.duration}</span>
                    </div>

                    <h3 className={`text-xl font-bold mb-3 ${step.status === 'locked' ? 'text-slate-500' : 'text-slate-100'}`}>
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-300 border border-slate-700/50">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {step.status === 'active' && (
                      <button onClick={() => navigate('/courses')}
                        className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                        Resume Path <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </TiltCard>
              </div>

              {/* Center Dot */}
              <div className="relative z-10 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center ${step.status === 'completed' ? 'bg-emerald-500 shadow-emerald-500/20' :
                    step.status === 'active' ? 'bg-blue-600 shadow-blue-600/40 animate-pulse' : 'bg-slate-800'
                  }`}>
                  {step.status === 'completed' ? (
                    <Flag className="w-5 h-5 text-white" />
                  ) : step.status === 'active' ? (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Spacer/Empty Side */}
              <div className="flex-1 hidden md:block">
                {step.status === 'active' && (
                  <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-500/10 backdrop-blur-sm">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">NEXT MILESTONE</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Complete the <span className="font-bold text-slate-100">"Interactive Design"</span> module to unlock the AI Agents track.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Summary Footer with delayed animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="p-10 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-[3rem] mt-24 text-center"
      >
        <div className="flex items-center justify-center gap-8 mb-10">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-100 min-w-[70px]">
              <AnimatedCounter value={85} suffix="%" delay={1400} />
            </p>
            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Consistency</p>
          </div>
          <div className="w-px h-12 bg-slate-800"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-100 min-w-[50px]">
              <AnimatedCounter value={24} delay={1400} />
            </p>
            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Days Left</p>
          </div>
          <div className="w-px h-12 bg-slate-800"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-100 min-w-[60px]">
              <AnimatedCounter value={4.8} decimals={1} delay={1400} />
            </p>
            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Avg Score</p>
          </div>
        </div>
        <button onClick={() => { showToast('Progress link copied to clipboard! 🎉'); navigator.clipboard?.writeText(window.location.href).catch(() => { }); }}
          className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mx-auto">
          Share Your Progress <Share2 className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-2xl z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roadmap;
