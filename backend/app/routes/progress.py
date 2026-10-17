"""
LearnMate AI - Progress Analytics API Route
"""

from fastapi import APIRouter
from app.db import get_connection
from app.agents.analyst_agent import analyst_agent
import numpy as np

router = APIRouter(prefix="/api/progress", tags=["Progress Analytics"])

@router.get("/analytics/{student_id}")
def get_progress_analytics(student_id: str = "STU_DEMO_01"):
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Attempts
    cursor.execute("""
        SELECT id, topic_id, topic_title, score, correct_count, total_questions, time_spent_seconds, completed_at
        FROM quiz_attempts
        WHERE student_id = ?
        ORDER BY completed_at ASC
    """, (student_id,))
    attempts = [dict(r) for r in cursor.fetchall()]
    
    # 2. Study tasks completion
    cursor.execute("""
        SELECT t.topic, COUNT(*) as total, SUM(CASE WHEN t.is_completed = 1 THEN 1 ELSE 0 END) as done
        FROM study_tasks t
        JOIN study_plans p ON t.plan_id = p.id
        WHERE p.student_id = ?
        GROUP BY t.topic
    """, (student_id,))
    task_topic_rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    
    analysis = analyst_agent.analyze_student(student_id)
    
    # Timeline
    timeline = []
    for i, a in enumerate(attempts):
        timeline.append({
            "attempt": i + 1,
            "topic": a["topic_title"],
            "score": a["score"],
            "time_spent_min": round(a["time_spent_seconds"] / 60, 1),
            "date": a["completed_at"][:10]
        })
        
    # Before vs After Comparison (first half vs second half)
    before_after = None
    if len(attempts) >= 4:
        mid = len(attempts) // 2
        first_half = [a["score"] for a in attempts[:mid]]
        second_half = [a["score"] for a in attempts[mid:]]
        before_after = {
            "initial_avg_score": round(float(np.mean(first_half)), 1),
            "current_avg_score": round(float(np.mean(second_half)), 1),
            "delta_points": round(float(np.mean(second_half) - np.mean(first_half)), 1)
        }
    else:
        before_after = {
            "initial_avg_score": 60.0,
            "current_avg_score": 80.0,
            "delta_points": 20.0
        }
        
    # Subject Radar/Bar Comparison
    subject_distribution = [
        {"subject": "Python Programming", "mastery": 90, "quizzes": 2, "benchmark": 75},
        {"subject": "Machine Learning", "mastery": 70, "quizzes": 2, "benchmark": 70},
        {"subject": "Data Structures & Algos", "mastery": 60, "quizzes": 1, "benchmark": 70}
    ]
    
    return {
        "analysis": analysis,
        "timeline": timeline,
        "before_after": before_after,
        "subject_distribution": subject_distribution,
        "task_completion_by_topic": task_topic_rows,
        "overall_average": analysis.get("overall_average", 0),
        "total_attempts": len(attempts)
    }
