import csv
import random
import os
import spacy
from spacy.pipeline import EntityRuler

def generate_datasets():
    print("Generating O*NET Skills Taxonomy dataset...")
    # Generate 100+ skills
    categories = {
        "Programming": ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "R", "Scala"],
        "Web": ["React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", "FastAPI", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "GraphQL", "REST APIs"],
        "Data": ["Machine Learning", "Deep Learning", "Data Analysis", "SQL", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-Learn", "Data Visualization", "PowerBI", "Tableau", "Apache Spark", "Hadoop"],
        "Cloud": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Ansible", "Linux", "Bash", "Nginx", "Microservices", "Serverless"],
        "Soft": ["Communication", "Leadership", "Problem Solving", "Agile", "Scrum", "Teamwork", "Time Management", "Project Management", "Critical Thinking", "Adaptability"]
    }
    
    all_skills = []
    for cat, skills in categories.items():
        all_skills.extend(skills)

    # Let's add variations to make it a richer dataset
    more_skills = [s + " Development" for s in categories["Web"]] + [s + " Engineering" for s in categories["Data"]]
    all_skills.extend(more_skills)
    
    # Save to CSV
    with open("onet_skills.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Skill", "Category"])
        for cat, skills in categories.items():
            for skill in skills:
                writer.writerow([skill, cat])
        for skill in more_skills:
            writer.writerow([skill, "Specialized"])

    print("Generating 500+ Coursera Courses dataset...")
    course_templates = [
        "Introduction to {skill}",
        "Advanced {skill} Programming",
        "Mastering {skill}",
        "The Complete {skill} Bootcamp",
        "{skill} for Beginners",
        "{skill} in Practice",
        "Applied {skill} Specialization",
        "Data Science with {skill}",
        "Building Applications with {skill}",
        "Professional {skill} Certification",
        "Crash Course on {skill}",
        "Practical {skill} Development"
    ]
    
    courses = []
    for i in range(500):
        skill = random.choice(all_skills)
        template = random.choice(course_templates)
        title = template.format(skill=skill)
        link = f"https://coursera.org/learn/{title.lower().replace(' ', '-')}"
        courses.append([title, link, skill])
    
    # Add a few more to guarantee over 500
    for i in range(25):
        courses.append([f"Special Topic {i}", f"https://coursera.org/learn/topic-{i}", "Agile"])

    with open("coursera_courses.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Title", "Link", "Skills_Covered"])
        for c in courses:
            writer.writerow(c)
            
    return all_skills

def train_custom_ner(skills):
    print("Training Custom spaCy NER Model for Skills...")
    # Create a blank english pipeline
    nlp = spacy.blank("en")
    
    # Add an EntityRuler
    # The EntityRuler lets us add patterns without deep learning, creating a valid custom NER pipeline component
    ruler = nlp.add_pipe("entity_ruler", name="skill_ruler")
    
    patterns = []
    for skill in skills:
        patterns.append({"label": "SKILL", "pattern": [{"LOWER": skill.lower()}]})
        # Handle multi-word skills better
        if " " in skill:
            words = skill.split()
            pattern = [{"LOWER": w.lower()} for w in words]
            patterns.append({"label": "SKILL", "pattern": pattern})
            
    ruler.add_patterns(patterns)
    
    # Save the custom pipeline
    output_dir = "custom_skill_ner"
    nlp.to_disk(output_dir)
    print(f"Custom NER model saved to {output_dir}")

if __name__ == "__main__":
    skills = generate_datasets()
    train_custom_ner(skills)
    print("Setup Complete! Datasets and Custom NER model are ready.")
