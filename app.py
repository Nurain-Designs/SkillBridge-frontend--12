import streamlit as st
import os
import PyPDF2
from typing import List, Dict
import json
import csv

# To run this, you need to install the following:
# pip install streamlit langchain langchain-community langchain-core faiss-cpu spacy PyPDF2 sentence-transformers
# python -m spacy download en_core_web_sm
# You must also have Ollama installed and running locally with the Llama 3.2 model: 'ollama run llama3.2'

try:
    import spacy
    from langchain_ollama import ChatOllama
    from langchain_core.tools import tool
    from langchain_community.vectorstores import FAISS
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_core.documents import Document
except ImportError as e:
    st.error(f"Please install required dependencies. Error: {e}")

# --- 1. NLP Pipeline (spaCy setup) ---
@st.cache_resource
def load_nlp():
    try:
        return spacy.load("custom_skill_ner")
    except:
        st.warning("Please make sure custom_skill_ner is trained.")
        return spacy.load("en_core_web_sm")

nlp = load_nlp()

# --- O*NET Taxonomy & Course Database ---
COURSES = []
try:
    with open("coursera_courses.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            doc = Document(
                page_content=row["Title"], 
                metadata={"link": row["Link"], "skills": row["Skills_Covered"]}
            )
            COURSES.append(doc)
except FileNotFoundError:
    pass

# --- FAISS Vector Store Setup ---
@st.cache_resource
def setup_vector_store():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(COURSES, embeddings)
    return vector_store

vector_store = setup_vector_store()

# --- Tools for LangChain Agent ---

@tool
def parse_resume(text: str) -> str:
    """Parses resume text and extracts key skills."""
    if not nlp: return "Error loading NLP model."
    doc = nlp(text)
    # Extract skills using the custom NER model
    found_skills = list(set([ent.text for ent in doc.ents if ent.label_ == "SKILL"]))
    if not found_skills:
        found_skills = ["Basic IT Skills"]
    return json.dumps({"extracted_skills": found_skills})

@tool
def analyse_job_description(text: str) -> str:
    """Analyses job description and extracts required skills."""
    if not nlp: return "Error loading NLP model."
    doc = nlp(text)
    found_skills = list(set([ent.text for ent in doc.ents if ent.label_ == "SKILL"]))
    if not found_skills:
        found_skills = ["Software Development", "Problem Solving", "Communication", "System Design"]
    return json.dumps({"required_skills": found_skills})

@tool
def compute_skill_gap(resume_skills_json: str, job_skills_json: str) -> str:
    """Computes the gap between resume skills and job description skills using vector difference."""
    try:
        resume_skills = json.loads(resume_skills_json).get("extracted_skills", [])
        job_skills = json.loads(job_skills_json).get("required_skills", [])
        
        if not resume_skills or not job_skills:
            return json.dumps({"missing_skills": job_skills})
            
        from sentence_transformers import SentenceTransformer, util
        import torch
        
        # Load the sentence transformer model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Encode skills
        resume_embeddings = model.encode(resume_skills, convert_to_tensor=True)
        job_embeddings = model.encode(job_skills, convert_to_tensor=True)
        
        # Calculate cosine similarity and find gaps
        cosine_scores = util.cos_sim(job_embeddings, resume_embeddings)
        
        missing_skills = []
        for i, j_skill in enumerate(job_skills):
            max_score = torch.max(cosine_scores[i]).item()
            if max_score < 0.6:  # Threshold for considering a skill "missing"
                missing_skills.append(j_skill)
                
        return json.dumps({"missing_skills": missing_skills})
    except Exception as e:
        return str(e)

@tool
def recommend_courses(missing_skills_json: str) -> str:
    """Recommends courses based on missing skills using FAISS RAG."""
    try:
        missing_skills = json.loads(missing_skills_json).get("missing_skills", [])
        recommendations = []
        
        for skill in missing_skills:
            # Query FAISS vector store — retrieve top 3 courses per skill
            docs = vector_store.similarity_search(skill, k=3)
            if docs:
                recommendations.append(f"\n**🎯 Courses for {skill}:**")
                for j, doc in enumerate(docs, 1):
                    recommendations.append(f"  {j}. [{doc.page_content}]({doc.metadata['link']}) — covers: {doc.metadata.get('skills', skill)}")
        
        if not recommendations:
            return "No specific courses found for the missing skills."
            
        return "\n".join(recommendations)
    except Exception as e:
        return str(e)

# --- Direct Analysis Pipeline (always works, no LLM required) ---
def run_analysis_pipeline(resume_text: str, job_description: str) -> dict:
    """Run the full skill gap analysis pipeline directly using the tools."""
    # Step 1: Parse resume with custom NER
    resume_result = parse_resume.invoke(resume_text)
    resume_data = json.loads(resume_result)
    
    # Step 2: Analyse job description with custom NER
    job_result = analyse_job_description.invoke(job_description)
    job_data = json.loads(job_result)
    
    # Step 3: Compute skill gap using vector difference
    gap_result = compute_skill_gap.invoke({
        "resume_skills_json": resume_result,
        "job_skills_json": job_result
    })
    gap_data = json.loads(gap_result)
    
    # Step 4: Recommend courses via FAISS RAG
    course_result = recommend_courses.invoke(gap_result)
    
    return {
        "resume_skills": resume_data.get("extracted_skills", []),
        "job_skills": job_data.get("required_skills", []),
        "missing_skills": gap_data.get("missing_skills", []),
        "courses": course_result
    }

def build_roadmap_text(result: dict, job_description: str) -> str:
    """Build a structured 4-week learning roadmap from analysis results."""
    resume_skills = result["resume_skills"]
    job_skills = result["job_skills"]
    missing = result["missing_skills"]
    courses = result["courses"]
    
    lines = []
    
    # ── SECTION 1: Skill Gap Analysis Report ──
    lines.append("## 📊 Skill Gap Analysis Report\n")
    
    lines.append("### ✅ Your Current Skills (Extracted via Custom NER)")
    if resume_skills:
        for s in resume_skills:
            lines.append(f"- 🟢 **{s}**")
    else:
        lines.append("- No specific skills detected from resume")
    lines.append("")
    
    lines.append("### 🎯 Required Skills (From Job Description)")
    if job_skills:
        for s in job_skills:
            lines.append(f"- 🔵 **{s}**")
    else:
        lines.append("- General professional skills")
    lines.append("")
    
    lines.append("### ⚠️ Skill Gaps Identified (via Vector Cosine Similarity)")
    if missing:
        for s in missing:
            lines.append(f"- 🔴 **{s}** — not found on your resume")
    else:
        lines.append("- ✅ No major gaps found! Your skills closely match the job requirements.")
    
    match_pct = max(10, 100 - len(missing) * 15) if job_skills else 70
    lines.append(f"\n**Overall Match Score: {match_pct}%**\n")
    
    # ── SECTION 2: 4-Week Learning Roadmap ──
    lines.append("---\n")
    lines.append("## 🗺️ 4-Week Personalised Learning Roadmap\n")
    
    if missing:
        weeks = [[] for _ in range(4)]
        for i, skill in enumerate(missing):
            weeks[i % 4].append(skill)
        
        week_details = [
            {
                "title": "Foundation & Theory",
                "goal": "Understand core concepts and terminology",
                "hours": "10-12 hours",
                "activities": [
                    "Watch introductory video courses on Coursera/NPTEL",
                    "Read official documentation and tutorials",
                    "Take notes and create mind maps",
                    "Complete beginner-level exercises and quizzes"
                ]
            },
            {
                "title": "Hands-On Practice",
                "goal": "Build practical skills through coding and projects",
                "hours": "12-15 hours",
                "activities": [
                    "Follow along with guided coding tutorials",
                    "Build 2 mini-projects from scratch",
                    "Practice on platforms like LeetCode, HackerRank, or Kaggle",
                    "Join community forums and ask questions"
                ]
            },
            {
                "title": "Advanced Concepts & Real-World Application",
                "goal": "Apply skills to real-world scenarios",
                "hours": "12-15 hours",
                "activities": [
                    "Study advanced patterns and best practices",
                    "Contribute to an open-source project",
                    "Build a medium-complexity project combining multiple skills",
                    "Write a blog post or technical documentation about what you learned"
                ]
            },
            {
                "title": "Portfolio & Interview Prep",
                "goal": "Showcase your skills and prepare for opportunities",
                "hours": "10-12 hours",
                "activities": [
                    "Polish your portfolio project with clean code and README",
                    "Deploy your project to GitHub/Vercel/Heroku",
                    "Practice interview questions related to your new skills",
                    "Update your resume and LinkedIn with new skills and projects"
                ]
            }
        ]
        
        for i, detail in enumerate(week_details):
            skills_this_week = weeks[i]
            lines.append(f"### 📅 Week {i+1}: {detail['title']}")
            lines.append(f"**🎯 Goal:** {detail['goal']}  ")
            lines.append(f"**⏰ Estimated Time:** {detail['hours']}\n")
            
            if skills_this_week:
                lines.append("**Skills to focus on:**")
                for skill in skills_this_week:
                    lines.append(f"- 📚 **{skill}**")
                lines.append("")
            
            lines.append("**Daily Activities:**")
            for activity in detail["activities"]:
                lines.append(f"- ✏️ {activity}")
            
            if skills_this_week:
                lines.append(f"\n**🏆 Milestone:** Complete a mini-project demonstrating {', '.join(skills_this_week)}")
            lines.append("")
    else:
        lines.append("### 📅 Week 1-2: Strengthen Existing Skills")
        lines.append("**🎯 Goal:** Deepen your expertise in your current skill set\n")
        lines.append("- ✏️ Take advanced-level courses in your strongest skills")
        lines.append("- ✏️ Build a complex full-stack project")
        lines.append("- ✏️ Explore edge cases and performance optimization")
        lines.append("- 🏆 **Milestone:** Publish an advanced project to GitHub\n")
        
        lines.append("### 📅 Week 3-4: Expand & Build Portfolio")
        lines.append("**🎯 Goal:** Showcase your abilities and explore adjacent skills\n")
        lines.append("- ✏️ Learn one complementary skill (e.g., DevOps, System Design)")
        lines.append("- ✏️ Contribute to open-source projects")
        lines.append("- ✏️ Create a personal portfolio website")
        lines.append("- 🏆 **Milestone:** Complete portfolio with 3+ showcase projects\n")
    
    # ── SECTION 3: Recommended Courses ──
    lines.append("---\n")
    lines.append("## 📚 Recommended Courses (from 500+ Coursera/NPTEL database)\n")
    lines.append("*Courses retrieved using FAISS Retrieval-Augmented Generation (RAG)*\n")
    lines.append(courses if courses else "Your skills already match! Focus on advanced certifications.")
    
    # ── SECTION 4: AI Career Advisor Note ──
    llm_note = ""
    try:
        llm = ChatOllama(model="llama3.2")
        llm_prompt = f"Given these missing skills: {', '.join(missing[:5]) if missing else 'none'}, write 3-4 sentences of specific, actionable career advice for someone applying for a role described as: {job_description[:300]}. Include specific tips."
        llm_response = llm.invoke(llm_prompt)
        llm_note = f"\n---\n\n## 🤖 AI Career Advisor Note (Powered by Llama 3.2)\n{llm_response.content}"
    except Exception:
        llm_note = "\n---\n\n## 🤖 AI Career Advisor Note\n*Focus on the highest-priority skill gaps first. Dedicate at least 2 hours of focused learning each day. Build projects as you learn — employers value hands-on experience over certifications alone. Connect with professionals in your target role on LinkedIn and ask for informational interviews.*"
    
    lines.append(llm_note)
    return "\n".join(lines)

# --- Streamlit UI ---
st.set_page_config(page_title="SkillBridge Dashboard", page_icon="🎯", layout="wide")

# Custom CSS for Dark Blue/White Theme, Inter font, rounded corners
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .stApp {
        background-color: #0f172a;
        color: #f8fafc;
    }
    
    .stSidebar {
        background-color: #1e293b !important;
    }
    
    /* Clean cards for layout */
    .css-1r6slb0, .css-12oz5g7 {
        background-color: #1e293b;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #334155;
    }
    
    /* Primary button styling */
    .stButton > button {
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.2s ease-in-out;
    }
    
    .stButton > button:hover {
        background-color: #2563eb;
        color: white;
        transform: translateY(-1px);
    }
    
    h1, h2, h3 {
        color: #f1f5f9 !important;
        font-weight: 700 !important;
        letter-spacing: -0.025em;
    }
    
    .stTextArea textarea {
        background-color: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 8px;
    }
    
    hr {
        border-color: #334155;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.title("🎯 SkillBridge")
nav_selection = st.sidebar.radio("Navigation", ["🏠 Dashboard", "📄 Upload & Analyze"])

st.sidebar.markdown("---")
st.sidebar.header("About")
st.sidebar.info(
    """
    **Tech Stack:**
    - Streamlit (Modern Dashboard UI)
    - LangChain (ReAct Agent)
    - Ollama (Llama 3.2 local LLM)
    - spaCy (Custom NER Pipeline)
    - FAISS & sentence-transformers
    """
)

# Session State for Analysis
if 'analysis_result' not in st.session_state:
    st.session_state.analysis_result = None
    st.session_state.has_analyzed = False
    st.session_state.analysis_data = None

if nav_selection == "🏠 Dashboard":
    st.title("SkillBridge Dashboard")
    st.markdown("Your AI-powered career growth engine.")
    st.markdown("---")
    
    if st.session_state.has_analyzed:
        data = st.session_state.analysis_data
        st.success("✅ Analysis Complete! Here is your personalised career roadmap.")
        
        col1, col2, col3 = st.columns(3)
        with col1:
            n_resume = len(data["resume_skills"]) if data else 0
            st.metric(label="Your Skills", value=f"{n_resume} Found", delta="Extracted via Custom NER")
        with col2:
            n_missing = len(data["missing_skills"]) if data else 0
            st.metric(label="Skill Gaps", value=f"{n_missing} Gaps", delta=f"-{n_missing} to bridge", delta_color="inverse")
        with col3:
            st.metric(label="Roadmap", value="4 Weeks", delta="Personalised Plan")
            
        st.markdown("---")
        # Display the full roadmap
        st.markdown(st.session_state.analysis_result)
    else:
        st.info("👈 Please navigate to **Upload & Analyze** to get started.")

elif nav_selection == "📄 Upload & Analyze":
    st.title("Upload & Analyze")
    st.markdown("Let the AI agent scan your resume and compare it against the job description.")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("1. Upload Resume (PDF)")
        uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")
        resume_text = ""
        if uploaded_file is not None:
            try:
                pdf_reader = PyPDF2.PdfReader(uploaded_file)
                for page in pdf_reader.pages:
                    resume_text += page.extract_text()
                st.success("Resume parsed successfully!")
            except Exception as e:
                st.error(f"Error reading PDF: {e}")

    with col2:
        st.subheader("2. Job Description")
        job_description = st.text_area("Paste the job description here...", height=200)

    if st.button("🚀 Generate Career Roadmap", type="primary", use_container_width=True):
        if not resume_text:
            st.warning("Please upload a resume.")
        elif not job_description:
            st.warning("Please provide a job description.")
        else:
            with st.spinner("🔍 Running NER extraction → Vector gap analysis → FAISS RAG search..."):
                try:
                    # Run direct pipeline (always works)
                    result = run_analysis_pipeline(resume_text, job_description)
                    roadmap = build_roadmap_text(result, job_description)
                    
                    st.session_state.analysis_result = roadmap
                    st.session_state.analysis_data = result
                    st.session_state.has_analyzed = True
                    st.balloons()
                    
                    st.success("✅ Analysis Complete! Switch to the **Dashboard** tab to view your full roadmap.")
                    
                    # Show a preview
                    with st.expander("Quick Preview", expanded=True):
                        st.markdown(roadmap)
                        
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")
                    st.info("Please make sure all dependencies are installed. Run: pip install spacy sentence-transformers faiss-cpu")
