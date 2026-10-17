"""
LearnMate AI - Quiz & Assessment API Route
"""

from fastapi import APIRouter, HTTPException
from app.db import get_connection
from app.agents.quiz_agent import quiz_agent
from app.schemas.models import QuizSubmissionRequest

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])

@router.get("/topics")
def get_quiz_topics():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, category, description, badge, total_questions FROM quiz_topics")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"topics": rows}

@router.get("/topic/{topic_id}")
def get_quiz_for_topic(topic_id: str):
    res = quiz_agent.get_questions_for_topic(topic_id)
    if not res["questions"]:
        raise HTTPException(status_code=404, detail="Topic questions not found")
    return res

@router.post("/submit")
def submit_quiz_answers(payload: QuizSubmissionRequest):
    res = quiz_agent.evaluate_submission(
        student_id=payload.student_id,
        topic_id=payload.topic_id,
        user_answers=payload.user_answers,
        time_spent_sec=payload.time_spent_seconds
    )
    return res
