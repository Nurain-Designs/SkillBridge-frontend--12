import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Edit3, 
  Briefcase, 
  Github, 
  Twitter, 
  Linkedin,
  Award,
  Zap,
  Target,
  X,
  Camera,
  Phone,
  Save,
  Loader2
} from 'lucide-react';
import TiltCard from '../components/TiltCard';

const Profile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_PROFILE = {
    name: 'Hafsa',
    role: 'Full-Stack AI/ML Intern',
    email: 'hafsa.dev@gmail.com',
    location: 'Reva University, Bangalore',
    website: 'github.com/Hafsa2122',
    phone: '+1 (555) 000-1234',
    bio: 'MCA Final Year Student at Reva University with a strong passion for building intelligent, full-stack web applications. Currently working as a Full-Stack AI/ML Developer Intern at MJ Smart Solutions, where I design and develop AI-powered features, integrate LLM-based pipelines, and build scalable React + Python backends.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hafsa',
    banner: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=2000&q=80'
  };

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_profile_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Auto-migrate the old colorful banner to the professional deep blue one
        if (parsed.banner === 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80') {
          parsed.banner = DEFAULT_PROFILE.banner;
          localStorage.setItem('skillbridge_profile_v3', JSON.stringify(parsed));
        }
        return parsed;
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

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

  // Process dynamic stats
  const matchScore = analysisData?.match_score || 92;
  
  const defaultStack = [
    { name: 'UI Design', level: 95, color: 'bg-emerald-500' },
    { name: 'Interaction', level: 88, color: 'bg-blue-500' },
    { name: 'AI UX', level: 82, color: 'bg-indigo-500' },
    { name: 'Framer Motion', level: 75, color: 'bg-pink-500' },
    { name: 'TypeScript', level: 68, color: 'bg-amber-500' },
    { name: 'User Research', level: 90, color: 'bg-cyan-500' }
  ];

  let verifiedSkills = defaultStack;
  if (analysisData?.resume_skills && analysisData.resume_skills.length > 0) {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500', 'bg-amber-500', 'bg-cyan-500'];
    verifiedSkills = analysisData.resume_skills.slice(0, 6).map((skill: string, index: number) => ({
      name: skill,
      level: Math.floor(Math.random() * 20) + 80, // High levels for verified resume skills
      color: colors[index % colors.length]
    }));
  }

  let achievements = [
    { label: 'Top 1% Skills', icon: Target, color: 'text-emerald-400' },
    { label: 'Certified AI UI', icon: Award, color: 'text-blue-400' },
    { label: 'Growth Hacker', icon: Zap, color: 'text-amber-400' }
  ];

  if (analysisData) {
    achievements = [];
    if (matchScore >= 90) {
      achievements.push({ label: 'Top 1% Match', icon: Target, color: 'text-emerald-400' });
    } else if (matchScore >= 75) {
      achievements.push({ label: 'Strong Candidate', icon: Target, color: 'text-emerald-400' });
    }

    const aiRelated = ['ai', 'machine learning', 'python', 'nlp', 'data'];
    const hasAI = verifiedSkills.some((s: any) => aiRelated.some(ai => s.name.toLowerCase().includes(ai)));
    if (hasAI) achievements.push({ label: 'Certified AI Expert', icon: Award, color: 'text-blue-400' });

    const uiRelated = ['ui', 'ux', 'design', 'react', 'frontend', 'figma'];
    const hasUI = verifiedSkills.some((s: any) => uiRelated.some(ui => s.name.toLowerCase().includes(ui)));
    if (hasUI) achievements.push({ label: 'UI/UX Master', icon: Zap, color: 'text-amber-400' });

    if (achievements.length === 0) {
      achievements.push({ label: 'Fast Learner', icon: Zap, color: 'text-purple-400' });
    }
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem('skillbridge_profile_v3', JSON.stringify(profileData));
      } catch {
        // localStorage quota exceeded — avatar too large, save without it
        const { avatar: _a, ...rest } = profileData;
        localStorage.setItem('skillbridge_profile_v3', JSON.stringify({ ...rest, avatar: DEFAULT_PROFILE.avatar }));
      }
      window.dispatchEvent(new Event('profileUpdated'));
      setIsSaving(false);
      setIsEditModalOpen(false);
    }, 1500);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const SIZE = 400;
      const canvas = document.createElement('canvas');
      canvas.width  = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const side = Math.min(img.width, img.height);
        const sx = (img.width  - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
      }
      const compressed = canvas.toDataURL('image/jpeg', 0.85);
      URL.revokeObjectURL(objectUrl);
      setProfileData((prev: typeof DEFAULT_PROFILE) => ({ ...prev, avatar: compressed }));
    };
    img.src = objectUrl;
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const SIZE = 400;
      const canvas = document.createElement('canvas');
      canvas.width  = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const side = Math.min(img.width, img.height);
        const sx = (img.width  - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
      }
      const compressed = canvas.toDataURL('image/jpeg', 0.85);
      URL.revokeObjectURL(objectUrl);
      
      const newProfileData = { ...profileData, avatar: compressed };
      setProfileData(newProfileData);
      
      try {
        localStorage.setItem('skillbridge_profile_v3', JSON.stringify(newProfileData));
      } catch {
        const { avatar: _a, ...rest } = newProfileData;
        localStorage.setItem('skillbridge_profile_v3', JSON.stringify({ ...rest, avatar: DEFAULT_PROFILE.avatar }));
      }
      window.dispatchEvent(new Event('profileUpdated'));
    };
    img.src = objectUrl;
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      // Compress banner to max 1200px width at 80% quality
      const MAX_WIDTH = 1200;
      const canvas = document.createElement('canvas');
      const ratio = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      const compressed = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(objectUrl);

      const newProfileData = { ...profileData, banner: compressed };
      setProfileData(newProfileData);

      try {
        localStorage.setItem('skillbridge_profile_v3', JSON.stringify(newProfileData));
      } catch {
        // If it still exceeds quota, skip saving banner
        const { banner: _b, ...rest } = newProfileData;
        localStorage.setItem('skillbridge_profile_v3', JSON.stringify({ ...rest, banner: DEFAULT_PROFILE.banner }));
      }
      window.dispatchEvent(new Event('profileUpdated'));
    };
    img.src = objectUrl;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
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
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-blue-500 transition-all">
                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Profile Picture</h4>
                      <p className="text-sm text-slate-400">Click to upload a new image.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Job Role</label>
                      <input 
                        type="text" 
                        value={profileData.role}
                        onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio</label>
                    <textarea 
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 min-w-[200px]"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="relative h-[250px] rounded-[3rem] overflow-hidden border border-slate-800">
        <img 
          src={profileData.banner} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <button 
          onClick={() => bannerFileInputRef.current?.click()}
          className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all z-10"
        >
          <Edit3 className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={bannerFileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleBannerChange}
        />
      </div>

      <div className="px-12 -mt-24 relative z-10 flex flex-col md:flex-row items-end gap-8">
        <div className="relative group cursor-pointer" onClick={() => mainFileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-full border-8 border-slate-950 bg-slate-800 overflow-hidden shadow-2xl relative">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <input 
            type="file" 
            ref={mainFileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleMainImageChange}
          />
        </div>
        
        <div className="flex-1 pb-4 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">{profileData.name}</h1>
          <p className="text-blue-400 font-bold mt-1 uppercase tracking-widest text-sm flex items-center justify-center md:justify-start gap-2">
            <Briefcase className="w-4 h-4" />
            {profileData.role}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4 text-slate-400 text-sm font-medium">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profileData.location}</span>
            <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> {profileData.website}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-4">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            Edit Profile
          </button>
          <div className="flex items-center gap-2">
            <a href="https://github.com/Hafsa2122" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Left Column - Details */}
        <div className="space-y-8">
          <div className="card p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem]">
            <h3 className="text-lg font-bold text-slate-100 mb-6">About Me</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {profileData.bio}
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Mail className="w-4 h-4 text-blue-400" /></div>
                <span className="text-sm text-slate-300">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Phone className="w-4 h-4 text-blue-400" /></div>
                <span className="text-sm text-slate-300">{profileData.phone}</span>
              </div>
            </div>
          </div>

          <div className="card p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem]">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Achievements</h3>
            <div className="space-y-4">
              {achievements.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-bold text-slate-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right Column - Stats & Skills */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TiltCard>
              <div className="card p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">MATCH SCORE</p>
                <h3 className="text-5xl font-extrabold mb-4">{matchScore}%</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Your skill profile is exceptionally aligned with the technical requirements.
                </p>
                <div className="mt-8 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${matchScore}%` }} className="h-full bg-white shadow-[0_0_15px_white]" />
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="card p-8 bg-slate-900/60 border border-slate-800 rounded-[2.5rem]">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">LEVEL PROGRESS</p>
                <h3 className="text-3xl font-extrabold text-slate-100 mb-4">Level 24</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Only 450 XP left to reach <span className="text-blue-400 font-bold">Level 25</span> and unlock the AI Pro badge.
                </p>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] animate-shimmer"></div>
                  <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                </div>
              </div>
            </TiltCard>
          </div>

          <div className="card p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem]">
            <h3 className="text-lg font-bold text-slate-100 mb-8">Verified Skill Stack</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {verifiedSkills.map((skill, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span className="truncate pr-2">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full ${skill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
