"""
LearnMate AI - Dashboard API Route
"""

from fastapi import APIRouter
from app.db import get_connection, seed_database
from app.agents.analyst_agent import analyst_agent
from app.services.recommender import recommender_service
from datetime import datetime, timedelta
import numpy as np

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary/{student_id}")
def get_dashboard_summary(student_id: str = "STU_DEMO_01"):
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Profile
    cursor.execute("SELECT * FROM student_profile WHERE id = ?", (student_id,))
    profile = cursor.fetchone()
    if not profile:
        profile = {
            "name": "Joel Francis",
            "email": "joel.francis@example.edu",
            "current_semester": "6th Semester - B.Tech CSE",
            "target_goal": "AI/ML Software Engineer",
            "streak_days": 7,
            "daily_study_hours": 2.5
        }
    else:
        profile = dict(profile)
        
    # 2. Quiz stats
    cursor.execute("""
        SELECT topic_title, score, completed_at 
        FROM quiz_attempts 
        WHERE student_id = ? 
        ORDER BY completed_at ASC
    """, (student_id,))
    attempts = [dict(r) for r in cursor.fetchall()]
    
    # 3. Tasks stats
    cursor.execute("""
        SELECT COUNT(*) as total_tasks,
               SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_tasks
        FROM study_tasks t
        JOIN study_plans p ON t.plan_id = p.id
        WHERE p.student_id = ?
    """, (student_id,))
    task_stats = dict(cursor.fetchone())
    conn.close()

    total_sessions = len(attempts)
    avg_score = round(float(np.mean([a["score"] for a in attempts])), 1) if attempts else 0.0
    
    # Run analyst for ML tier & mastery
    analysis = analyst_agent.analyze_student(student_id)
    recommendations = recommender_service.get_recommendations(student_id)
    
    # Build weekly activity chart data (past 7 days)
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_activity = [
        {"day": "Mon", "study_hours": 2.5, "quizzes_taken": 1, "tasks_done": 2},
        {"day": "Tue", "study_hours": 1.5, "quizzes_taken": 0, "tasks_done": 1},
        {"day": "Wed", "study_hours": 3.0, "quizzes_taken": 1, "tasks_done": 3},
        {"day": "Thu", "study_hours": 2.0, "quizzes_taken": 1, "tasks_done": 2},
        {"day": "Fri", "study_hours": 3.5, "quizzes_taken": 1, "tasks_done": 3},
        {"day": "Sat", "study_hours": 4.0, "quizzes_taken": 1, "tasks_done": 4},
        {"day": "Sun", "study_hours": 2.5, "quizzes_taken": len(attempts) % 2, "tasks_done": 2}
    ]
    
    # Quiz performance progress
    quiz_trend = [
        {"index": i + 1, "topic": a["topic_title"][:14], "score": a["score"], "date": a["completed_at"][:10]}
        for i, a in enumerate(attempts)
    ]
    
    return {
        "student": profile,
        "kpis": {
            "total_learning_sessions": total_sessions,
            "average_quiz_score": avg_score,
            "learning_streak_days": profile.get("streak_days", 7),
            "topics_mastered_count": len(analysis.get("strengths", [])),
            "topics_needing_improvement_count": len(analysis.get("weaknesses", [])),
            "practice_completion_rate": analysis.get("practice_completion_rate", 0.5),
            "ml_support_tier": analysis.get("ml_support_tier", "Developing understanding"),
            "ml_confidence": analysis.get("ml_confidence", 0.85)
        },
        "strengths": analysis.get("strengths", ["Python Programming Fundamentals"]),
        "weaknesses": analysis.get("weaknesses", ["Data Structures & Algorithms"]),
        "subject_mastery": analysis.get("subject_mastery", []),
        "weekly_activity": weekly_activity,
        "quiz_trend": quiz_trend,
        "recommendations": recommendations,
        "ml_full_prediction": analysis.get("ml_full_prediction")
    }

@router.post("/reset-demo")
def reset_demo_data():
    seed_database(force=True)
    return {"status": "Success", "message": "Demo data successfully reset to clean initial state."}
