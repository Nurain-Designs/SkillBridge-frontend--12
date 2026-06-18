# SkillBridge - Agentic AI Career Advisor & Skill Gap Analyser
## Project Report

### Internship Details

**1. Company Name:** MJ Smart Solutions

**2. Company Profile:** 
MJ Smart Solutions is an innovative technology organization focused on developing intelligent solutions for career development and professional growth. The company aims to bridge the gap between existing user skills and rapidly evolving industry requirements through the use of advanced Artificial Intelligence technologies. By combining Natural Language Processing, Large Language Models, and modern software technologies, MJ Smart Solutions provides personalized guidance and learning recommendations to individuals seeking career advancement.

**3. Role of the Intern:** Full-Stack AI Developer & UI/UX Designer Intern

**4. Activities Performed:**
- **UI/UX Design:** Designed high-fidelity wireframes and modern UI components using Figma, establishing a premium, dark-themed 3D glassmorphism aesthetic.
- **Frontend Development:** Engineered a responsive, interactive user interface utilizing React, Vite, Tailwind CSS, and Framer Motion.
- **Backend AI Integration:** Developed an agentic AI backend using Python, LangChain, and local LLMs (Llama 3.2 via Ollama) to parse resumes and perform autonomous skill gap analysis.
- **RAG System Implementation:** Integrated a Retrieval-Augmented Generation system with a FAISS vector database for contextual educational resource mapping.

**5. External Guide Name and Address:** Abhay Kumar Srivastav, Assistant Professor, School of Computer Science and Application

---

### 1. Abstract

The modern employment landscape is characterized by rapid technological advancement and a constantly shifting demand for specialized skills, making it increasingly challenging for job seekers and professionals to maintain competitive profiles. Traditional career counseling and educational planning often rely on generalized advice that lacks the precision required for today’s dynamic job market. To address this critical challenge, we present **SkillBridge**, an innovative, intelligent career development and skill gap analysis platform designed to democratize access to personalized, data-driven professional guidance. 

SkillBridge leverages state-of-the-art artificial intelligence methodologies, specifically combining an AI-agentic backend powered by local Large Language Models (LLM) with a robust Natural Language Processing (NLP) pipeline. At its core, the platform allows users to seamlessly upload their resumes and input desired job descriptions. The backend system, driven by a highly capable Llama 3.2 model running locally via Ollama, utilizes spaCy for semantic text extraction, accurately isolating both hard and soft skills from unstructured data. This local-first approach guarantees complete user data privacy, a significant advantage over cloud-reliant alternatives. 

Once the user's current competencies and the target role's requirements are parsed, the system employs a ReAct (Reasoning and Acting) Agent architecture to perform a comprehensive gap analysis. This autonomous agent logically deduces the specific skills the user lacks and initiates a Retrieval-Augmented Generation (RAG) workflow. By querying a localized FAISS vector database pre-loaded with comprehensive educational resources and course catalogs mapped to the O*NET taxonomy, the system intelligently matches the identified skill gaps with optimal learning materials.

The output is a highly structured, dynamically generated 4-week learning roadmap that provides actionable, step-by-step instructions and direct links to curated courses, empowering the user to systematically bridge their skill deficiencies. Furthermore, this intricate backend logic is surfaced through a meticulously designed, modern frontend interface. Built using React, Vite, and Tailwind CSS, the user interface features a premium 3D glassmorphism aesthetic, ensuring an engaging, intuitive, and visually stunning user experience. 

In summary, SkillBridge represents a paradigm shift in autonomous career advising. By successfully integrating sophisticated NLP, agentic AI decision-making, and high-fidelity UI/UX design, the project demonstrates a scalable, privacy-conscious solution that empowers individuals to navigate their professional trajectories with precision, confidence, and actionable foresight. This report details the comprehensive design, architectural choices, implementation phases, and the overarching vision that culminated in the successful deployment of the SkillBridge platform.

### 2. Introduction

The transition from academic environments or traditional employment into highly specialized, modern technical roles is increasingly fraught with complexity. The velocity at which industries adopt new technologies—such as Artificial Intelligence, Cloud Computing, and advanced Data Analytics—has created a persistent "skills gap" across the global workforce. For individuals, this translates into a daunting challenge: not only must they continuously learn new paradigms, but they must first accurately diagnose what specific skills they lack in relation to their target career trajectories. This project introduces **SkillBridge**, a comprehensive software solution designed to mitigate this friction by serving as an intelligent, autonomous career advisor. 

By leveraging the cutting-edge capabilities of local Large Language Models and sophisticated Natural Language Processing, SkillBridge seeks to democratize high-quality career guidance. Unlike static job boards or generic educational platforms, SkillBridge is designed as a dynamic, interactive agent that provides bespoke, actionable roadmaps tailored specifically to the unique intersection of a user's existing resume and the explicit demands of their desired job description.

#### Problem Statement

The core problem addressed by this project is the pervasive inefficiency and inaccuracy in personal career development and skill acquisition. In today's highly competitive and rapidly evolving job market, job seekers face several compounding difficulties:

1. **Information Asymmetry and Ambiguity:** Job descriptions are often dense, jargon-heavy, and poorly aligned with standardized skill taxonomies. Candidates frequently struggle to decode the explicit and implicit technical and soft skills required by employers.
2. **Inaccurate Self-Assessment:** Without expert guidance, individuals often misjudge their own competencies, leading to either under-qualification for applied roles or wasted time studying irrelevant materials.
3. **The "Execution Gap" in Upskilling:** Even when a candidate successfully identifies a missing skill (e.g., "I need to learn React"), they are immediately faced with the paradox of choice. The internet is flooded with thousands of courses, tutorials, and bootcamps of varying quality. Selecting the optimal resource and structuring it into a manageable learning timeline is an overwhelming task that often leads to decision paralysis.
4. **Inaccessibility of Professional Counseling:** Human career counseling and executive coaching can provide this level of personalized guidance, but these services are inherently unscalable, prohibitively expensive for the average job seeker, and often lack deep, up-to-date technical domain knowledge.

Consequently, there is a critical need for an automated, scalable, and highly accurate system capable of parsing complex professional backgrounds, comparing them against real-time market demands, and prescribing a definitive, actionable path forward.

#### Scope of the Problem

The scope of this project encompasses the design, development, and deployment of the SkillBridge platform to directly solve the issues outlined in the problem statement. The project bounds the problem by focusing specifically on the technical and analytical orchestration required to bridge the gap between a candidate's current state and their target state. 

The defined scope of the SkillBridge solution includes:
- **Intelligent Document Parsing:** The system must accurately ingest and process unstructured data from user resumes (specifically in PDF format) and free-text job descriptions.
- **Semantic Skill Extraction:** Moving beyond simple keyword matching, the system must utilize Natural Language Processing (via spaCy) and Large Language Models to semantically understand and extract established skills (aligned with taxonomies like O*NET) from the provided texts.
- **Automated Gap Computation:** The core logical engine must accurately cross-reference the extracted candidate skills against the extracted job requirements to isolate the exact "missing links" in the candidate's profile.
- **Contextual Resource Retrieval:** Utilizing a Retrieval-Augmented Generation (RAG) architecture with a FAISS vector database, the system is scoped to match the identified skill gaps with highly relevant, high-quality educational resources (e.g., Coursera links, documentation).
- **Roadmap Generation:** The final deliverable of the system is restricted to the generation of a customized, structured 4-week learning roadmap. This roadmap must synthesize the missing skills and recommended resources into a logical, week-by-week study plan.
- **Target Demographics:** The solution is designed to accommodate a wide spectrum of users, primarily targeting early-to-mid career professionals seeking rapid upskilling, recent university graduates transitioning into the workforce, and career changers pivoting into new technical domains.
- **Privacy and Architecture Scope:** A critical constraint within the project scope is the commitment to user data privacy. The architecture is explicitly designed to run AI inference locally (using Ollama and Llama 3.2), ensuring sensitive resume data is not transmitted to external, third-party APIs.

This scope ensures the project remains focused on delivering a highly functional, secure, and user-centric application that tangibly solves the problem of automated career path optimization.

### 3. System Requirements
**Hardware Requirements:**
- CPU: Multi-core processor (Intel i5/Ryzen 5 or higher)
- RAM: Minimum 8GB (16GB+ recommended for running local LLMs efficiently)
- Storage: 10GB available space

**Software Requirements:**
- **Operating System:** Windows, macOS, or Linux
- **Frontend Stack:** Node.js (v18+), React 18, Vite, Tailwind CSS v4, Framer Motion, Radix UI components.
- **Backend Stack:** Python 3.9+, Streamlit, LangChain, Ollama (Llama 3.2 model), spaCy (`en_core_web_sm`), FAISS, PyPDF2.
- **Other Tools:** Figma (for UI/UX design), Git.

### 4. Literature Review
The integration of Artificial Intelligence in human resources and career planning has seen significant growth. Traditional applicant tracking systems (ATS) rely on basic keyword matching, which often fails to capture the nuance of a candidate's experience. Recent advancements in Large Language Models (LLMs) like Llama 3 and GPT architectures allow for semantic understanding of resumes. Furthermore, the use of Retrieval-Augmented Generation (RAG) ensures that AI recommendations are grounded in factual, up-to-date data. SkillBridge builds upon these concepts by combining a ReAct (Reasoning and Acting) Agent with a local FAISS vector store to provide private, precise, and dynamic educational recommendations.

### 5. Data Collection / Dataset Description
The platform relies on the following data components:
- **User Resumes:** Uploaded securely as PDF documents and parsed on-the-fly using `PyPDF2`.
- **Job Descriptions:** Text input provided directly by the user.
- **Course Database (Vector Store):** A locally hosted FAISS vector database pre-loaded with educational content. The system uses a mock O*NET taxonomy to map skills (e.g., Python, Machine Learning, React, Cloud Computing) to corresponding courses (e.g., Coursera links). This database is queried using HuggingFace sentence embeddings (`all-MiniLM-L6-v2`) to retrieve the most relevant resources for the identified skill gaps.

### 6. Gantt Chart / Project Timeline

| Week | Phase | Tasks |
|------|-------|-------|
| **Week 1** | Design & Planning | Requirements gathering, architecture design, and high-fidelity UI/UX design in Figma (Dark-themed SaaS UI). |
| **Week 2** | Frontend Development | Setup React+Vite project, implement Tailwind CSS design system, build UI components (Dashboard, Profile, Settings), and add Framer Motion animations. |
| **Week 3** | Backend Development | Setup Python environment, build Streamlit interface, integrate PyPDF2, configure spaCy NLP pipeline, and set up FAISS vector store. |
| **Week 4** | AI Integration & Testing | Implement LangChain ReAct agent with local Ollama Llama 3.2, test prompt engineering, integrate frontend/backend concepts, debug, and finalize deployment setup. |

### 7. Conclusion
The SkillBridge platform successfully demonstrates the viability of using local, agentic AI for personalized career counseling. By combining a highly engaging, premium frontend interface with a robust and privacy-conscious backend (local LLM execution), the system empowers users to take control of their career trajectories. The dynamic 4-week learning plans generated by the AI provide clear, actionable steps for professional development, effectively bridging the gap between current proficiencies and market demands.

---

### Appendix 2: Company Profile
**Company Name:** MJ Smart Solutions
**Company Overview:**
MJ Smart Solutions is an innovative technology organization focused on developing intelligent solutions for career development and professional growth. The company aims to bridge the gap between existing user skills and rapidly evolving industry requirements through the use of advanced Artificial Intelligence technologies. By combining Natural Language Processing, Large Language Models, and modern software technologies, MJ Smart Solutions provides personalized guidance and learning recommendations to individuals seeking career advancement.

**Mission:**
To democratize career development by providing accessible, intelligent, and AI-driven professional guidance along with personalized learning roadmaps that help individuals achieve their career goals.

**Vision:**
To create a future where every individual has access to smart tools and technologies that enable continuous learning, professional growth, and seamless adaptation to changing workforce demands.

**Core Technologies:**
- Artificial Intelligence (AI)
- Natural Language Processing (NLP)
- Large Language Models (LLMs)
- Retrieval-Augmented Generation (RAG)
- FAISS Vector Database
- React and Vite Framework
- Tailwind CSS
- Local AI Models through Ollama

**Services Provided:**
- Resume Analysis and Processing
- Skill Gap Identification
- Personalized Career Guidance
- Learning Resource Recommendations
- Structured Learning Roadmap Generation
- AI-powered Career Development Solutions

**Objectives:**
- To provide accurate and personalized career recommendations.
- To improve skill identification and learning efficiency.
- To ensure user data privacy through local AI processing.
- To support users in making informed career decisions.
- To create scalable and intelligent solutions for workforce development.

### Appendix 3: Research Paper Abstract / Paper
**Title:** *Agentic AI and Retrieval-Augmented Generation for Automated Skill Gap Analysis and Career Path Optimization*

**Abstract:** 
As the skills required for modern roles evolve rapidly, traditional methods of career counseling struggle to keep pace. This paper presents an automated framework utilizing a ReAct (Reasoning and Acting) LLM agent coupled with a FAISS-based Retrieval-Augmented Generation (RAG) system. The proposed architecture extracts semantic features from candidate resumes and job descriptions using spaCy, computes real-time skill gaps, and dynamically retrieves targeted educational courses. By deploying lightweight, local models (Llama 3.2), the system ensures data privacy while providing highly accurate, personalized 4-week learning roadmaps. Initial evaluations demonstrate high precision in skill extraction and relevance in course recommendations, highlighting the potential of agentic workflows in professional development platforms.
