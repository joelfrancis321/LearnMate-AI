"""
LearnMate AI - Learning Analyst Agent
Role: Reviews quiz history, computes mastery velocity, pinpoints weak spots and strengths, and interfaces with the ML classification engine.
"""

from typing import Dict, Any, List
import numpy as np
from app.db import get_connection
from app.ml.model import predictor

class LearningAnalystAgent:
    def __init__(self):
        self.name = "Learning Analyst Agent"
        self.role = "Performance Diagnostics & Learning Analytics"

    def analyze_student(self, student_id: str = "STU_DEMO_01") -> Dict[str, Any]:
        conn = get_connection()
        cursor = conn.cursor()
        
        # 1. Fetch all quiz attempts
        cursor.execute("""
            SELECT id, topic_id, topic_title, score, correct_count, total_questions, time_spent_seconds, completed_at
            FROM quiz_attempts
            WHERE student_id = ?
            ORDER BY completed_at ASC
        """, (student_id,))
        attempts = [dict(row) for row in cursor.fetchall()]
        
        # 2. Fetch student profile
        cursor.execute("SELECT * FROM student_profile WHERE id = ?", (student_id,))
        profile_row = cursor.fetchone()
        profile = dict(profile_row) if profile_row else {
            "name": "Student", "daily_study_hours": 2.0, "streak_days": 1
        }
        
        # 3. Calculate completed study tasks
        cursor.execute("""
            SELECT COUNT(*) as total_tasks, 
                   SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_tasks
            FROM study_tasks t
            JOIN study_plans p ON t.plan_id = p.id
            WHERE p.student_id = ?
        """, (student_id,))
        task_stats = dict(cursor.fetchone())
        conn.close()
        
        total_tasks = task_stats["total_tasks"] or 0
        completed_tasks = task_stats["completed_tasks"] or 0
        practice_completion_rate = round(completed_tasks / total_tasks, 2) if total_tasks > 0 else 0.5
        
        if not attempts:
            return {
                "agent": self.name,
                "status": "Insufficient Data",
                "message": "No quiz attempts recorded yet. Take an initial diagnostic quiz to generate your learning profile."
            }
            
        scores = [a["score"] for a in attempts]
        overall_avg = round(float(np.mean(scores)), 1)
        recent_scores = scores[-3:] if len(scores) >= 3 else scores
        recent_avg = round(float(np.mean(recent_scores)), 1)
        previous_score = scores[-2] if len(scores) >= 2 else scores[0]
        
        # Trend calculation: difference between recent average and early scores
        if len(scores) >= 3:
            early_avg = np.mean(scores[:2])
            trend = round(float((recent_avg - early_avg) / 100.0), 2)
        else:
            trend = 0.05
            
        # Subject-wise breakdown
        topic_scores = {}
        for a in attempts:
            t = a["topic_title"]
            if t not in topic_scores:
                topic_scores[t] = []
            topic_scores[t].append(a["score"])
            
        subject_mastery = []
        strengths = []
        weaknesses = []
        
        for topic, topic_sc in topic_scores.items():
            avg_sc = round(float(np.mean(topic_sc)), 1)
            status = "Mastered" if avg_sc >= 80 else ("Developing" if avg_sc >= 65 else "Needs Attention")
            subject_mastery.append({
                "topic": topic,
                "average_score": avg_sc,
                "attempts": len(topic_sc),
                "status": status
            })
            if avg_sc >= 80:
                strengths.append(topic)
            elif avg_sc < 70:
                weaknesses.append(topic)
                
        # ML Support Category Prediction
        ml_input = {
            "previous_quiz_score": previous_score,
            "recent_quiz_avg": recent_avg,
            "practice_completion_rate": practice_completion_rate,
            "quiz_attempts_count": len(attempts),
            "study_time_hours": float(profile.get("daily_study_hours", 2.0)) * 7.0,
            "performance_trend": trend
        }
        
        ml_prediction = predictor.predict(ml_input)
        
        return {
            "agent": self.name,
            "status": "Success",
            "student_id": student_id,
            "total_attempts": len(attempts),
            "overall_average": overall_avg,
            "recent_average": recent_avg,
            "performance_trend": trend,
            "subject_mastery": subject_mastery,
            "strengths": strengths if strengths else ["Python Programming Fundamentals"],
            "weaknesses": weaknesses if weaknesses else ["Data Structures & Algorithms"],
            "practice_completion_rate": practice_completion_rate,
            "ml_support_tier": ml_prediction["predicted_category"],
            "ml_confidence": ml_prediction["confidence"],
            "ml_explanation": ml_prediction["pedagogical_explanation"],
            "recommended_focus": ml_prediction["recommended_focus"],
            "ml_full_prediction": ml_prediction
        }

analyst_agent = LearningAnalystAgent()
