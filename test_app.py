import sys
import json
import torch
print("Testing imports...")
try:
    from app import parse_resume, analyse_job_description, compute_skill_gap, recommend_courses, nlp
    print("Imports successful.")
except Exception as e:
    print("Error importing from app.py:", e)
    sys.exit(1)

print("Testing parse_resume...")
res = parse_resume.run("I am a software engineer with 5 years of experience in Python, Machine Learning, and AWS.")
print(res)

print("Testing analyse_job_description...")
res2 = analyse_job_description.run("We need someone with strong Python, Deep Learning, and CI/CD skills.")
print(res2)

print("Testing compute_skill_gap...")
res3 = compute_skill_gap.run({"resume_skills_json": res, "job_skills_json": res2})
print(res3)

print("Testing recommend_courses...")
res4 = recommend_courses.run(res3)
print(res4)
print("All tests passed.")
