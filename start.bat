@echo off
echo ==============================================
echo   SkillBridge - AI Career Advisor
echo   Full-Stack Application
echo ==============================================
echo.

echo [1/2] Starting Python AI Backend (Port 5000)...
echo   - Custom NER Pipeline
echo   - FAISS Vector Store (500+ courses)
echo   - Skill Vector Analysis
echo   - Flask REST API
start /B cmd /c "python api_server.py"

echo [2/2] Starting React Dashboard (Port 5173)...
echo   - Dashboard, Profile, Settings
echo   - Resume Upload, Skill Analysis
echo   - Courses, Roadmap
echo.
echo ==============================================
echo   App will open at: http://localhost:5173
echo   API running at:   http://localhost:5000
echo ==============================================
echo.

npm run dev
