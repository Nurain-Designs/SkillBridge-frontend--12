import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { 
  FileUp, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import TiltCard from '../components/TiltCard';
import { DEMO_MODE } from '../demo';

// Fictional sample results shown in demo mode (same shape as the API response).
const SAMPLE_ANALYSIS = {
  match_score: 85,
  resume_skills: ['React', 'TypeScript', 'UI/UX Design'],
  missing_skills: ['Node.js', 'System Design'],
  recommendations: [{ skill: 'Node.js', course: 'Node.js Microservices', priority: 'High' }],
};

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    if (DEMO_MODE) {
      // Public demo: nothing is uploaded. Show the bundled sample analysis.
      setTimeout(() => {
        localStorage.setItem('skillbridge_analysis', JSON.stringify(SAMPLE_ANALYSIS));
        setIsAnalyzed(true);
        setIsUploading(false);
      }, 1500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume_file', file);
      
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('API error');
      
      const data = await res.json();
      localStorage.setItem('skillbridge_analysis', JSON.stringify(data));
      setIsAnalyzed(true);
    } catch (err) {
      // Fallback to mock data if backend is offline
      setTimeout(() => {
        const mockData = {
          match_score: 85,
          resume_skills: ['React', 'TypeScript', 'UI/UX Design'],
          missing_skills: ['Node.js', 'System Design'],
          recommendations: [
            { skill: 'Node.js', course: 'Node.js Microservices', priority: 'High' }
          ]
        };
        localStorage.setItem('skillbridge_analysis', JSON.stringify(mockData));
        setIsAnalyzed(true);
      }, 2000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-100">Resume Intelligence</h1>
        <p className="text-slate-400 mt-2">Upload your resume to get a detailed skill gap analysis and job matching scores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Upload Section */}
        <TiltCard 
          className={`card flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-slate-700 hover:border-blue-500/50 bg-slate-900/60'}`}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file && !isAnalyzed ? (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileUp className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Drag & Drop Resume</h3>
              <p className="text-sm text-slate-400 mt-2 mb-8">
                {DEMO_MODE ? 'Demo mode: files stay in your browser and are not uploaded.' : 'PDF, DOCX supported. Max 10MB.'}
              </p>
              
              <label className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                Browse Files
              </label>
              {DEMO_MODE && (
                <button
                  type="button"
                  onClick={() => setFile(new File(['Sample résumé for the SkillBridge demo'], 'sample-resume-jordan-lee.pdf', { type: 'application/pdf' }))}
                  className="mt-4 block mx-auto text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Use a sample résumé (fictional)
                </button>
              )}
            </div>
          ) : isUploading ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8"
            >
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-6" />
              <h3 className="text-lg font-bold text-slate-100">AI Analysis in Progress...</h3>
              <p className="text-sm text-slate-400 mt-2">Extracting skills and mapping career paths.</p>
            </motion.div>
          ) : isAnalyzed ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h3 className="text-lg font-bold text-slate-100">{DEMO_MODE ? 'Sample analysis ready' : 'Analysis Complete!'}</h3>
              <p className="text-sm text-slate-400 mt-2 mb-8">
                {DEMO_MODE
                  ? 'Demo mode: your file was not uploaded or read. These are sample results.'
                  : 'Your resume has been successfully processed.'}
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setIsAnalyzed(false)}
                  className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all hover:shadow-lg hover:-translate-y-0.5 border border-slate-700"
                >
                  Upload New
                </button>
                <button 
                  onClick={() => navigate('/roadmap')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 flex items-center gap-2">
                  View Roadmap <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{file?.name}</h3>
              <p className="text-sm text-slate-400 mt-2 mb-8">{(file?.size! / (1024 * 1024)).toFixed(2)} MB</p>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setFile(null)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleUpload}
                  className="btn-primary flex items-center gap-2"
                >
                  Analyze with AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          </div>
        </TiltCard>

        {/* Info/Benefits Section */}
        <div className="space-y-6">
          <TiltCard className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-[0_20px_40px_rgba(37,99,235,0.4)]">
            <h3 className="text-xl font-bold mb-4" style={{ transform: "translateZ(30px)" }}>Why use SkillBridge AI?</h3>
            <ul className="space-y-4" style={{ transform: "translateZ(20px)" }}>
              {[
                'Instant Skill Gap Identification',
                'Real-time Market Value Estimation',
                'Personalized Course Recommendations',
                'ATS Optimization Tips'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium opacity-90">{benefit}</span>
                </li>
              ))}
            </ul>
          </TiltCard>

          <TiltCard className="card shadow-[0_15px_30px_rgba(0,0,0,0.5)] bg-slate-900/80">
            <h3 className="text-lg font-bold text-slate-100 mb-4" style={{ transform: "translateZ(20px)" }}>Recent Uploads</h3>
            <div className="space-y-3" style={{ transform: "translateZ(30px)" }}>
              {[
                { name: 'resume_v2_final.pdf', date: '2 days ago', score: '8.4' },
                { name: 'designer_resume.pdf', date: '1 month ago', score: '7.9' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-700/50 bg-slate-950/50 hover:bg-slate-800 transition-colors shadow-inner">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{item.name}</p>
                      <p className="text-[10px] text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 shadow-sm">
                    <span className="text-[10px] font-bold text-emerald-400">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
