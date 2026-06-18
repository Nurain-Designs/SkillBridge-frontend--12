import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, BookOpen, Clock, Star, PlayCircle, Award, X, Play, SkipForward, CheckCircle2, Lock, Maximize2, ChevronRight, Layers } from 'lucide-react';
import TiltCard from '../components/TiltCard';

interface Chapter { id: number; title: string; duration: string; ytId: string; completed: boolean; locked: boolean; }
interface Course { id: number; title: string; instructor: string; category: string; rating: number; students: string; duration: string; level: string; price: string; image: string; progress: number; description: string; chapters: Chapter[]; }

const COURSES: Course[] = [
  {
    id: 1, title: 'Advanced Figma Masterclass', instructor: 'Sarah Jenkins',
    category: 'UI/UX Design', rating: 4.9, students: '12k', duration: '18h 45m',
    level: 'Advanced', price: '$89.99', progress: 0,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563bc4c?auto=format&fit=crop&w=800&q=80',
    description: 'Master Figma with advanced techniques — auto layout, component variants, prototyping, and design systems used by top product teams.',
    chapters: [
      { id: 1, title: 'Welcome & Design Fundamentals', duration: '5:20', ytId: 'OEV8gMkCHXQ', completed: false, locked: false },
      { id: 2, title: 'Auto Layout & Constraints',     duration: '18:45', ytId: 'mr15Xzb1Ook', completed: false, locked: false },
      { id: 3, title: 'Component Variants',            duration: '22:10', ytId: 'Tn6-PIqc4UM', completed: false, locked: true },
      { id: 4, title: 'Design Tokens & Systems',       duration: '31:00', ytId: 'zQnBQ4tB3ZA', completed: false, locked: true },
      { id: 5, title: 'Prototyping & Handoff',         duration: '25:30', ytId: 'Sklc_fQBmcs', completed: false, locked: true },
    ]
  },
  {
    id: 2, title: 'React & Framer Motion 3D', instructor: 'David Chen',
    category: 'Frontend', rating: 4.8, students: '8k', duration: '12h 30m',
    level: 'Intermediate', price: '$74.99', progress: 65,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    description: 'Build stunning 3D animated React apps with Framer Motion — gestures, scroll animations, and physics-based interactions.',
    chapters: [
      { id: 1, title: 'React Hooks Refresher',       duration: '12:00', ytId: 'Tn6-PIqc4UM', completed: true,  locked: false },
      { id: 2, title: 'Framer Motion Basics',        duration: '19:30', ytId: 'DHjqpvDnNGE', completed: true,  locked: false },
      { id: 3, title: '3D Transforms & TiltCard',    duration: '28:15', ytId: 'OEV8gMkCHXQ', completed: false, locked: false },
      { id: 4, title: 'Gesture & Drag Controls',     duration: '22:40', ytId: 'mr15Xzb1Ook', completed: false, locked: true },
      { id: 5, title: 'Scroll-Linked Animations',    duration: '17:50', ytId: 'zQnBQ4tB3ZA', completed: false, locked: true },
    ]
  },
  {
    id: 3, title: 'Python for AI Agents', instructor: 'Dr. Michael Watts',
    category: 'AI & ML', rating: 4.9, students: '15k', duration: '24h 00m',
    level: 'Expert', price: '$129.99', progress: 20,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
    description: 'Build autonomous AI agents using LangChain, LLMs, and Python. Memory, tool use, multi-agent orchestration & deployment.',
    chapters: [
      { id: 1, title: 'Python & Environment Setup',   duration: '15:00', ytId: 'x7X9w_GIm1s', completed: true,  locked: false },
      { id: 2, title: 'LangChain & LLM Basics',       duration: '24:10', ytId: 'DHjqpvDnNGE', completed: false, locked: false },
      { id: 3, title: 'Tool Calling & Functions',     duration: '33:20', ytId: 'Tn6-PIqc4UM', completed: false, locked: true },
      { id: 4, title: 'Agent Memory & RAG',           duration: '40:00', ytId: 'zQnBQ4tB3ZA', completed: false, locked: true },
      { id: 5, title: 'Multi-Agent Orchestration',   duration: '28:30', ytId: 'ENrzD9HAZK4', completed: false, locked: true },
    ]
  },
  {
    id: 4, title: 'Fullstack Node.js & Prisma', instructor: 'Alex Rivera',
    category: 'Backend', rating: 4.7, students: '6k', duration: '20h 15m',
    level: 'Advanced', price: '$94.99', progress: 0,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Production-ready REST APIs with Node.js, Express, Prisma ORM & PostgreSQL. Auth, caching, rate limiting, and CI/CD.',
    chapters: [
      { id: 1, title: 'Node.js & Express Setup',   duration: '10:00', ytId: 'ENrzD9HAZK4', completed: false, locked: false },
      { id: 2, title: 'Prisma Schema & Migrations', duration: '20:45', ytId: 'zQnBQ4tB3ZA', completed: false, locked: true },
      { id: 3, title: 'JWT Auth & Middleware',      duration: '27:30', ytId: 'DHjqpvDnNGE', completed: false, locked: true },
      { id: 4, title: 'Redis Caching Layer',        duration: '22:15', ytId: 'x7X9w_GIm1s', completed: false, locked: true },
      { id: 5, title: 'Deploy on Railway + CI/CD',  duration: '15:00', ytId: 'Sklc_fQBmcs', completed: false, locked: true },
    ]
  },
];

export default function Courses() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const browseAllTracks = () => {
    setFilter('All');
    setSearch('');
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categories = ['All', 'UI/UX Design', 'Frontend', 'Backend', 'AI & ML'];
  const filtered = COURSES.filter(c =>
    (filter === 'All' || c.category === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))
  );

  const openCourse = (course: Course) => { setActiveCourse(course); setChapterIdx(0); setAutoplay(false); };
  const closeCourse = () => { setActiveCourse(null); setAutoplay(false); };
  const selectChapter = (idx: number) => { setChapterIdx(idx); setAutoplay(true); };
  const nextChapter = () => { if (activeCourse && chapterIdx < activeCourse.chapters.length - 1) selectChapter(chapterIdx + 1); };

  const goFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  const chapter = activeCourse?.chapters[chapterIdx];
  const ytSrc = chapter ? `https://www.youtube.com/embed/${chapter.ytId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}` : '';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Video Player Modal ── */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/60 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={closeCourse} className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all">
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{activeCourse.category}</p>
                  <h2 className="text-base font-bold text-slate-100 leading-tight">{activeCourse.title}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>by <span className="text-slate-200 font-semibold">{activeCourse.instructor}</span></span>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-400">{activeCourse.rating}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

              {/* YouTube Player */}
              <div className="flex-1 flex flex-col min-w-0 bg-black">
                <div className="relative flex-1 flex items-center justify-center">
                  <iframe
                    ref={iframeRef}
                    key={`${activeCourse.id}-${chapterIdx}`}
                    src={ytSrc}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title={chapter?.title}
                  />
                  {/* Custom Fullscreen Button */}
                  <button onClick={goFullscreen}
                    className="absolute top-3 right-3 p-2 bg-slate-900/70 backdrop-blur-md rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Chapter Info */}
                <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-950/80 flex-shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">
                        Chapter {chapterIdx + 1} of {activeCourse.chapters.length}
                      </p>
                      <h3 className="text-lg font-bold text-slate-100">{chapter?.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{activeCourse.description}</p>
                    </div>
                    <button onClick={nextChapter}
                      disabled={chapterIdx >= activeCourse.chapters.length - 1}
                      className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2">
                      Next <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                  {activeCourse.progress > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${activeCourse.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      </div>
                      <span className="text-xs font-bold text-blue-400">{activeCourse.progress}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chapter Sidebar */}
              <div className="w-72 flex-shrink-0 border-l border-slate-800/60 flex flex-col bg-slate-950/50">
                <div className="p-4 border-b border-slate-800/60">
                  <h4 className="font-bold text-slate-100 text-sm">Course Chapters</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{activeCourse.chapters.length} lessons · {activeCourse.duration}</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {activeCourse.chapters.map((ch, idx) => (
                    <button key={ch.id}
                      onClick={() => !ch.locked && selectChapter(idx)}
                      disabled={ch.locked}
                      className={`w-full flex items-start gap-3 p-4 text-left border-b border-slate-800/40 transition-all
                        ${chapterIdx === idx ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : 'hover:bg-slate-800/30'}
                        ${ch.locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                        ${ch.completed ? 'bg-emerald-500/20 text-emerald-400' : chapterIdx === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        {ch.completed ? <CheckCircle2 className="w-4 h-4" /> : ch.locked ? <Lock className="w-3 h-3" /> : chapterIdx === idx ? <Play className="w-3.5 h-3.5 ml-0.5" /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-snug truncate
                          ${chapterIdx === idx ? 'text-blue-400' : ch.completed ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {ch.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{ch.duration}</p>
                      </div>
                      {chapterIdx === idx && <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Recommended Courses</h1>
          <p className="text-slate-400 mt-2">Personalized learning paths based on your skill gaps.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all w-full md:w-[280px]" />
          </div>
          <button className="p-3 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700 hover:text-white hover:bg-slate-700 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all border
              ${filter === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(course => (
            <TiltCard key={course.id} className="h-full">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] overflow-hidden flex flex-col h-full group hover:border-blue-500/30 transition-colors">
                <div className="relative h-48 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-950/60 backdrop-blur-md text-slate-100 text-[10px] font-bold rounded-lg border border-slate-700/50 uppercase tracking-wider">{course.level}</span>
                  </div>
                  <button onClick={() => openCourse(course)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-600/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50 hover:scale-110 transition-transform">
                      <PlayCircle className="w-7 h-7 text-white" />
                    </div>
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{course.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1 leading-tight group-hover:text-blue-400 transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">by {course.instructor}</p>
                  <p className="text-xs text-slate-500 mb-5 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-6 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-200">{course.rating}</span>
                      <span className="text-xs text-slate-500">({course.students})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-400">{course.duration}</span>
                    </div>
                  </div>
                  {course.progress > 0 && (
                    <div className="mb-5 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-blue-400 font-bold">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }}
                          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      </div>
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-800/50">
                    <span className="text-xl font-bold text-slate-100">{course.price}</span>
                    <button onClick={() => openCourse(course)}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5" /> Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No courses found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
          <button onClick={() => { setSearch(''); setFilter('All'); }} className="mt-6 text-blue-400 font-bold hover:underline">Clear filters</button>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 rounded-[2.5rem] border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Get Certified by Industry Leaders</h3>
            <p className="text-slate-400 mt-1">Complete your tracks to earn AI-verified career certifications.</p>
          </div>
        </div>
        <button
          onClick={browseAllTracks}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 group"
        >
          <Layers className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Browse All Tracks
        </button>
      </div>
    </div>
  );
}
