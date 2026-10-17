"""
LearnMate AI - Study Planner API Route
"""

from fastapi import APIRouter, HTTPException
from app.db import get_connection
from app.agents.planner_agent import planner_agent
from app.agents.analyst_agent import analyst_agent
from app.schemas.models import PlanCreateRequest, TaskToggleRequest
from datetime import datetime

router = APIRouter(prefix="/api/planner", tags=["Study Planner"])

@router.get("/active/{student_id}")
def get_active_plan(student_id: str = "STU_DEMO_01"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, student_id, subject, target_goal, deadline_date, daily_hours, status, created_at
        FROM study_plans
        WHERE student_id = ? AND status = 'Active'
        ORDER BY id DESC LIMIT 1
    """, (student_id,))
    plan_row = cursor.fetchone()
    
    if not plan_row:
        conn.close()
        return {"has_plan": False, "plan": None, "tasks": []}
        
    plan = dict(plan_row)
    cursor.execute("""
        SELECT id, plan_id, day_number, title, topic, estimated_minutes, is_completed, completed_at
        FROM study_tasks
        WHERE plan_id = ?
        ORDER BY day_number ASC, id ASC
    """, (plan["id"],))
    tasks = [dict(t) for t in cursor.fetchall()]
    conn.close()
    
    total = len(tasks)
    completed = sum(1 for t in tasks if t["is_completed"])
    percent = round((completed / total * 100) if total > 0 else 0, 1)
    
    return {
        "has_plan": True,
        "plan": plan,
        "total_tasks": total,
        "completed_tasks": completed,
        "completion_rate_percent": percent,
        "tasks": tasks
    }

@router.post("/create")
def create_custom_study_plan(payload: PlanCreateRequest):
    weaknesses = payload.weaknesses
    if not weaknesses:
        analysis = analyst_agent.analyze_student(payload.student_id)
        weaknesses = analysis.get("weaknesses", ["Data Structures & Algorithms", "Model Evaluation Metrics"])
        
    result = planner_agent.generate_plan(
        student_id=payload.student_id,
        subject=payload.subject,
        target_goal=payload.target_goal,
        deadline_days=payload.deadline_days,
        daily_hours=payload.daily_hours,
        weaknesses=weaknesses
    )
    return result

@router.post("/toggle-task")
def toggle_task_completion(payload: TaskToggleRequest):
    conn = get_connection()
    cursor = conn.cursor()
    completed_val = 1 if payload.is_completed else 0
    now_val = datetime.now().isoformat() if payload.is_completed else None
    
    cursor.execute("""
        UPDATE study_tasks
        SET is_completed = ?, completed_at = ?
        WHERE id = ?
    """, (completed_val, now_val, payload.task_id))
    conn.commit()
    conn.close()
    
    return {"status": "Success", "task_id": payload.task_id, "is_completed": payload.is_completed}
