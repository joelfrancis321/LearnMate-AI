"""
LearnMate AI - Career Guide Agent
Role: Recommends industry-aligned learning tracks, portfolio capstone projects, and targeted skills for student career aspirations.
"""

from typing import Dict, Any, List

CAREER_PATHS = {
    "ai_ml_engineer": {
        "title": "AI / Machine Learning Engineer",
        "description": "Develops, trains, and operationalizes machine learning models into production systems and APIs.",
        "core_skills": [
            "Python (NumPy, Pandas, Scikit-Learn)",
            "Model Evaluation & Feature Engineering",
            "FastAPI / Flask microservice deployment",
            "Data structures & algorithmic efficiency",
            "Basic Deep Learning (PyTorch or TensorFlow)"
        ],
        "capstone_projects": [
            "Student Performance Predictor API with FastAPI and Scikit-Learn",
            "End-to-End Image Classifier deployed on Docker",
            "Algorithmic Trading Backtester using Pandas"
        ],
        "recommended_certifications": [
            "DeepLearning.AI Machine Learning Specialization",
            "Scikit-Learn & ML applied certifications",
            "AWS Certified Machine Learning - Specialty"
        ]
    },
    "data_scientist": {
        "title": "Data Scientist / Analytics Specialist",
        "description": "Extracts actionable insights from structured and unstructured data using statistics, ML, and storytelling.",
        "core_skills": [
            "Statistical Hypothesis Testing & Probability",
            "Pandas, SQL & Exploratory Data Analysis (EDA)",
            "Predictive Modeling (Regression & Classification)",
            "Data Visualization (Matplotlib, Seaborn, Tableau/PowerBI)",
            "Model interpretability & stakeholder presentations"
        ],
        "capstone_projects": [
            "Customer Churn Predictive Modeling with SHAP Explainability",
            "Healthcare Diagnostic Analytics Dashboard",
            "E-Commerce Sales Forecasting using Time Series Analysis"
        ],
        "recommended_certifications": [
            "IBM Data Science Professional Certificate",
            "Google Advanced Data Analytics Certificate"
        ]
    },
    "full_stack_ai": {
        "title": "Full-Stack AI Application Developer",
        "description": "Bridges web engineering and applied AI by building reactive user interfaces integrated with ML inference endpoints.",
        "core_skills": [
            "React, TypeScript, Vite, and Tailwind CSS",
            "FastAPI / Node.js backend architecture",
            "REST APIs, state management, and real-time sockets",
            "SQLite / PostgreSQL database design",
            "Agent orchestration and prompt engineering"
        ],
        "capstone_projects": [
            "LearnMate AI - Personalized Learning Companion",
            "Interactive Medical Assistant with Local RAG Knowledge Base",
            "Smart Code Review Assistant with Automated Linter"
        ],
        "recommended_certifications": [
            "Meta Front-End & Back-End Developer Certificates",
            "PostgreSQL & Database Architecture Specialty"
        ]
    }
}

class CareerGuideAgent:
    def __init__(self):
        self.name = "Career Guide Agent"
        self.role = "Career Pathway & Industry Skill Strategist"

    def recommend(self, career_goal: str = "ai_ml_engineer", current_strengths: List[str] = None) -> Dict[str, Any]:
        key = "ai_ml_engineer"
        lowered = career_goal.lower()
        if "data" in lowered or "analyst" in lowered or "science" in lowered:
            key = "data_scientist"
        elif "full" in lowered or "web" in lowered or "stack" in lowered or "developer" in lowered:
            key = "full_stack_ai"
            
        path_info = CAREER_PATHS[key]
        
        # Skill gap analysis based on current strengths
        strengths_set = set([s.lower() for s in (current_strengths or [])])
        readiness = "Strong Foundation" if len(strengths_set) >= 2 else "Developing Readiness"
        
        return {
            "agent": self.name,
            "status": "Success",
            "career_goal": path_info["title"],
            "overview": path_info["description"],
            "readiness_tier": readiness,
            "core_skills": path_info["core_skills"],
            "capstone_projects": path_info["capstone_projects"],
            "recommended_certifications": path_info["recommended_certifications"],
            "action_advice": (
                f"To excel as a {path_info['title']}, focus on building 1-2 end-to-end portfolio projects that demonstrate "
                f"both algorithmic rigor and clean code packaging. Emphasize metrics and verifiable evaluation."
            )
        }

career_agent = CareerGuideAgent()
