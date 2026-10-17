"""
LearnMate AI - Tutor Agent
Role: Explains topics in simple language, provides code examples, and retrieves structured explanations from curated local knowledge base.
"""

from typing import Dict, Any
from app.services.knowledge_base import knowledge_service

class TutorAgent:
    def __init__(self):
        self.name = "Tutor Agent"
        self.role = "Academic Explainer & Concept Tutor"

    def execute(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        result = knowledge_service.search(query)
        
        explanation_text = result["response"]
        code = result.get("code_example")
        takeaway = result.get("key_takeaway")
        
        return {
            "agent": self.name,
            "status": "Success",
            "topic": result.get("topic", "General"),
            "title": result.get("title", "Concept Explanation"),
            "explanation": explanation_text,
            "code_snippet": code,
            "key_takeaway": takeaway,
            "matched": result["matched"],
            "source": result["source_attribution"],
            "confidence": result["confidence"]
        }

tutor_agent = TutorAgent()
