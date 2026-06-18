import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  Target, 
  BookOpen, 
  Map, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router';
import AnimatedBackground from './AnimatedBackground';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick }: SidebarItemProps) => (
  <Link 
    to={path}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
    {!collapsed && <span className="font-semibold">{label}</span>}
    {active && !collapsed && (
      <motion.div 
        layoutId="active-pill"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
      />
    )}
  </Link>
);



const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_profile_v3');
      return saved ? JSON.parse(saved) : {
        name: 'Hafsa',
        role: 'Full-Stack AI/ML Intern',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hafsa'
      };
    } catch {
      return {
        name: 'Hafsa',
        role: 'Full-Stack AI/ML Intern',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hafsa'
      };
    }
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = localStorage.getItem('skillbridge_profile_v3');
        if (saved) setProfileData(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Resume Upload', icon: FileUp, path: '/resume-upload' },
    { label: 'Skill Analysis', icon: Target, path: '/skill-analysis' },
    { label: 'Courses', icon: BookOpen, path: '/courses' },
    { label: 'Roadmap', icon: Map, path: '/roadmap' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="relative flex h-screen bg-black overflow-hidden text-slate-100">
      <AnimatedBackground />
      
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: collapsed ? 100 : 280 }}
        className="hidden md:flex flex-col bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/50 p-6 relative transition-all z-50 shadow-2xl"
      >
        <div className={`flex items-center gap-3 mb-10 ${collapsed ? 'justify-center' : ''}`}>
          <div className="bg-primary p-2 rounded-xl">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-primary tracking-tight">SkillBridge</span>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex ml-auto p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.label}
              {...item}
              active={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-500" />
            {!collapsed && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-slate-900/80 backdrop-blur-xl z-50 p-6 flex flex-col md:hidden border-r border-slate-800/50"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold text-primary">SkillBridge</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <SidebarItem 
                    key={item.label}
                    {...item}
                    active={location.pathname === item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
              <div className="pt-6 border-t border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent relative z-20">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/50 px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl w-64 lg:w-96 border border-slate-700">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analysis, courses..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-100">{profileData.name}</p>
                <p className="text-xs text-slate-400">{profileData.role}</p>
              </div>
              <img 
                src={profileData.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
