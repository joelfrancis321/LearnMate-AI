"""
LearnMate AI - AI Tutor API Route
"""

from fastapi import APIRouter
from app.schemas.models import TutorQueryRequest
from app.agents.tutor_agent import tutor_agent

router = APIRouter(prefix="/api/tutor", tags=["AI Tutor"])

@router.post("/query")
def ask_ai_tutor(payload: TutorQueryRequest):
    result = tutor_agent.execute(payload.query)
    return result

@router.get("/suggested-prompts")
def get_suggested_prompts():
    return {
        "prompts": [
            "What is the difference between supervised and unsupervised learning?",
            "How do Decision Trees split using Gini Impurity?",
            "Explain Precision, Recall, and the F1-Score.",
            "What is the Bias-Variance tradeoff in machine learning?",
            "How do Python list comprehensions and generators work?",
            "Compare Breadth-First Search (BFS) and Depth-First Search (DFS)."
        ]
    }
