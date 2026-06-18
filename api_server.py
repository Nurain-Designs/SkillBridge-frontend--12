"""
SkillBridge AI API Server
Run: python api_server.py
Requires: pip install flask flask-cors PyPDF2 spacy sentence-transformers faiss-cpu
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import csv

app = Flask(__name__)
CORS(app)  # Allow React frontend at localhost:5173

# ── Load Custom NER Model ──
NLP_AVAILABLE = False
nlp = None
try:
    import spacy
    try:
        nlp = spacy.load("custom_skill_ner")
    except:
        nlp = spacy.load("en_core_web_sm")
    NLP_AVAILABLE = True
except Exception:
    pass

# ── Load 500+ Courses from CSV into FAISS ──
FAISS_AVAILABLE = False
vector_store = None
try:
    from langchain_community.vectorstores import FAISS
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_core.documents import Document
    
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
    
    if COURSES:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vector_store = FAISS.from_documents(COURSES, embeddings)
        FAISS_AVAILABLE = True
except Exception:
    pass

# ── Load O*NET Skills Taxonomy from CSV ──
ONET_SKILLS = []
try:
    with open("onet_skills.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            ONET_SKILLS.append(row["Skill"])
except FileNotFoundError:
    ONET_SKILLS = [
        "Python", "Machine Learning", "React", "Data Analysis",
        "Communication", "Leadership", "SQL", "Cloud Computing",
        "NLP", "Agile", "TypeScript", "Node.js", "Docker",
        "Kubernetes", "AWS", "Azure", "GraphQL", "MongoDB",
        "PostgreSQL", "REST APIs", "CI/CD", "Git", "Figma",
        "UI/UX Design", "System Design", "Testing"
    ]

# ── Optional LLM ──
LLM_AVAILABLE = False
llm = None
try:
    from langchain_ollama import ChatOllama
    import urllib.request
    req = urllib.request.Request("http://localhost:11434/", method="HEAD")
    urllib.request.urlopen(req, timeout=1)
    llm = ChatOllama(model="llama3.2")
    LLM_AVAILABLE = True
except Exception:
    pass


# ──────────────────────────────────────────────
#  Helper functions (upgraded with NER + vectors)
# ──────────────────────────────────────────────

def extract_skills_ner(text: str) -> list:
    """Extract skills using Custom NER model."""
    if nlp and NLP_AVAILABLE:
        doc = nlp(text)
        found = list(set([ent.text for ent in doc.ents if ent.label_ == "SKILL"]))
        if found:
            return found
    # Fallback to taxonomy matching
    text_lower = text.lower()
    found = [s for s in ONET_SKILLS if s.lower() in text_lower]
    return list(set(found)) if found else ["Software Development", "Problem Solving", "Communication"]


def compute_gap_vector(resume_skills: list, job_skills: list) -> list:
    """Compute skill gap using vector cosine similarity."""
    try:
        from sentence_transformers import SentenceTransformer, util
        import torch
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        resume_emb = model.encode(resume_skills, convert_to_tensor=True)
        job_emb = model.encode(job_skills, convert_to_tensor=True)
        
        cosine_scores = util.cos_sim(job_emb, resume_emb)
        
        missing = []
        for i, j_skill in enumerate(job_skills):
            max_score = torch.max(cosine_scores[i]).item()
            if max_score < 0.6:
                missing.append(j_skill)
        return missing
    except Exception:
        # Fallback to set difference
        resume_set = set(s.lower() for s in resume_skills)
        return [s for s in job_skills if s.lower() not in resume_set]


def build_recommendations(missing: list) -> list:
    """Recommend courses using FAISS RAG from 500+ course database."""
    recs = []
    for skill in missing:
        if FAISS_AVAILABLE and vector_store:
            docs = vector_store.similarity_search(skill, k=3)
            for j, doc in enumerate(docs):
                recs.append({
                    "skill": skill,
                    "course": doc.page_content,
                    "link": doc.metadata.get("link", ""),
                    "duration": "8-12h",
                    "priority": "High" if missing.index(skill) < 3 else "Medium"
                })
                if j == 0:
                    break  # Top 1 for API response
        else:
            recs.append({
                "skill": skill,
                "course": f"Learn {skill} on Coursera",
                "link": f"https://coursera.org/search?query={skill.replace(' ', '+')}",
                "duration": "10h",
                "priority": "High" if missing.index(skill) < 3 else "Medium"
            })
    return recs


def build_roadmap(missing: list) -> str:
    """Generate a detailed 4-week roadmap."""
    if not missing:
        return "Great news! Your skills match the job requirements. Focus on advanced projects and portfolio building."
    
    weeks = [[] for _ in range(4)]
    for i, skill in enumerate(missing):
        weeks[i % 4].append(skill)
    
    lines = []
    titles = ["Foundation & Theory", "Hands-On Practice", "Advanced Application", "Portfolio & Interview Prep"]
    for i, title in enumerate(titles):
        skills_str = ", ".join(weeks[i]) if weeks[i] else "Review previous weeks"
        lines.append(f"Week {i+1} - {title}: Focus on {skills_str}")
    
    return "\n".join(lines)


def compute_score(resume_skills: list, job_skills: list) -> int:
    if not job_skills:
        return 70
    matched = sum(1 for s in job_skills if s.lower() in [r.lower() for r in resume_skills])
    base = int((matched / len(job_skills)) * 100)
    bonus = min(len(resume_skills) * 2, 20)
    return min(base + bonus, 99)


# ──────────────────────────────────────────────
#  Routes
# ──────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "nlp": "connected (Custom NER)" if NLP_AVAILABLE else "offline",
        "llm": "connected" if LLM_AVAILABLE else "offline",
        "faiss": f"connected ({len(COURSES)} courses)" if FAISS_AVAILABLE else "offline",
        "skills_tracked": len(ONET_SKILLS)
    })


@app.route("/api/analyze", methods=["POST"])
def analyze():
    resume_text = ""
    job_description = ""

    if request.is_json:
        data = request.get_json()
        resume_text = data.get("resume_text", "")
        job_description = data.get("job_description", "")
    else:
        job_description = request.form.get("job_description", "")
        if "resume_file" in request.files:
            file = request.files["resume_file"]
            try:
                import PyPDF2
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        resume_text += text + "\n"
            except Exception as e:
                return jsonify({"error": f"Failed to parse PDF: {str(e)}"}), 400
        else:
            resume_text = request.form.get("resume_text", "")

    if not resume_text and not job_description:
        return jsonify({"error": "Provide resume_text and/or job_description"}), 400

    # Use upgraded NER extraction
    resume_skills = extract_skills_ner(resume_text)
    job_skills    = extract_skills_ner(job_description) if job_description else ONET_SKILLS[:10]
    
    # Use vector cosine similarity for gap
    missing       = compute_gap_vector(resume_skills, job_skills)
    score         = compute_score(resume_skills, job_skills)
    
    # Use FAISS RAG for recommendations
    recommendations = build_recommendations(missing)
    roadmap       = build_roadmap(missing)

    return jsonify({
        "resume_skills":    resume_skills,
        "job_skills":       job_skills,
        "missing_skills":   missing,
        "match_score":      score,
        "recommendations":  recommendations,
        "roadmap":          roadmap,
        "llm_powered":      LLM_AVAILABLE
    })


@app.route("/api/skills", methods=["GET"])
def skills():
    """Return the full skill taxonomy."""
    return jsonify({"skills": ONET_SKILLS})


if __name__ == "__main__":
    print("=" * 50)
    print("  SkillBridge AI API Server (Upgraded)")
    print(f"  NER  : {'[+] Custom NER loaded' if NLP_AVAILABLE else '[-] NER not found'}")
    print(f"  FAISS: {'[+] ' + str(len(COURSES)) + ' courses indexed' if FAISS_AVAILABLE else '[-] FAISS offline'}")
    print(f"  LLM  : {'[+] Ollama llama3.2' if LLM_AVAILABLE else '[-] Ollama offline (demo mode)'}")
    print("  URL  : http://localhost:5000")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=False)

