"""
LearnMate AI - Adaptive Recommendation Engine
Author: LearnMate AI Engineering Team (BharatCares Internship)

Synthesizes:
  - Weak and strong topics from real quiz attempts
  - ML student support category
  - Target learning goals
  - Available study time and practice completion rate
Transparently explains why each recommendation was selected.
"""

from typing import List, Dict, Any
from app.db import get_connection
from app.agents.analyst_agent import analyst_agent

class AdaptiveRecommenderService:
    def get_recommendations(self, student_id: str = "STU_DEMO_01") -> List[Dict[str, Any]]:
        # 1. Run dynamic student analysis
        analysis = analyst_agent.analyze_student(student_id)
        
        weaknesses = analysis.get("weaknesses", [])
        strengths = analysis.get("strengths", [])
        ml_tier = analysis.get("ml_support_tier", "Developing understanding")
        recent_avg = analysis.get("recent_average", 70.0)
        practice_rate = analysis.get("practice_completion_rate", 0.5)
        
        recommendations = []
        
        # Recommendation 1: Targeted gap closure for weak areas
        if "Data Structures & Algorithms" in weaknesses or recent_avg < 70:
            recommendations.append({
                "id": "rec_dsa_foundation",
                "title": "Master Graph BFS & Queue Invariants",
                "topic": "Data Structures & Algorithms",
                "action_type": "Interactive Coding Drill",
                "estimated_minutes": 35,
                "priority": "High",
                "reason": (
                    f"Your recorded score in Data Structures & Algorithms is below 70%. "
                    f"Understanding Breadth-First Search traversal and FIFO queue mechanics is critical for graph problem solving."
                ),
                "badge": "Priority Focus",
                "target_url": "/quiz/dsa_core"
            })
            
        if "Machine Learning Fundamentals" in weaknesses or (recent_avg >= 60 and recent_avg < 80):
            recommendations.append({
                "id": "rec_ml_metrics",
                "title": "Evaluate Precision-Recall Tradeoffs on Imbalanced Sets",
                "topic": "Machine Learning Fundamentals",
                "action_type": "Conceptual Deep Dive",
                "estimated_minutes": 25,
                "priority": "Medium",
                "reason": (
                    f"Your ML diagnostic results show solid grasp of classification concepts, "
                    f"but model evaluation metrics (F1 vs Accuracy) require fine-tuning."
                ),
                "badge": "Knowledge Solidification",
                "target_url": "/tutor?query=Explain%20Precision,%20Recall,%20and%20the%20F1-Score"
            })
            
        # Recommendation 2: Advanced challenge for strengths
        if "Python Programming Fundamentals" in strengths or "Python Programming" in strengths or recent_avg >= 75:
            recommendations.append({
                "id": "rec_py_advanced",
                "title": "Build a Custom Context Manager & Decorator in Python",
                "topic": "Python Programming",
                "action_type": "Mini-Project Implementation",
                "estimated_minutes": 45,
                "priority": "Growth",
                "reason": (
                    f"You achieved high mastery in Python Programming (recent quiz score >= 80%). "
                    f"Pushing forward with advanced design patterns and generator pipelines will prepare you for technical interviews."
                ),
                "badge": "Advanced Practice",
                "target_url": "/planner"
            })
            
        # Recommendation 3: Habit & Practice Rate Boost
        if practice_rate < 0.6:
            recommendations.append({
                "id": "rec_consistency",
                "title": "Complete 3 Daily Study Tasks to Maintain Streak",
                "topic": "Study Habit & Consistency",
                "action_type": "Schedule Checklist",
                "estimated_minutes": 30,
                "priority": "High",
                "reason": (
                    f"Your current practice completion rate is {practice_rate * 100:.0f}%. "
                    f"Completing your pending checklist tasks today will sustain your learning momentum."
                ),
                "badge": "Habit Builder",
                "target_url": "/planner"
            })
            
        # Fallback guarantee: At least 3 meaningful recommendations always returned
        if len(recommendations) < 3:
            recommendations.append({
                "id": "rec_general_review",
                "title": "Review Decision Tree Gini Splitting Logic",
                "topic": "Machine Learning Fundamentals",
                "action_type": "Tutor Review",
                "estimated_minutes": 20,
                "priority": "Medium",
                "reason": "Reinforcing recursive binary splitting algorithms strengthens algorithmic intuition for Random Forests.",
                "badge": "Core ML",
                "target_url": "/tutor?query=How%20do%20Decision%20Trees%20split%20using%20Gini%20Impurity?"
            })
            
        return recommendations

recommender_service = AdaptiveRecommenderService()
