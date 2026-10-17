"""
LearnMate AI - Study Planner Agent
Role: Synthesizes student learning goals, daily available study hours, and diagnosed weaknesses into realistic, milestone-driven study plans.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.db import get_connection

class StudyPlannerAgent:
    def __init__(self):
        self.name = "Study Planner Agent"
        self.role = "Adaptive Curriculum & Study Schedule Architect"

    def generate_plan(self, student_id: str, subject: str, target_goal: str, deadline_days: int = 14, daily_hours: float = 2.5, weaknesses: List[str] = None) -> Dict[str, Any]:
        if weaknesses is None or len(weaknesses) == 0:
            weaknesses = ["Data Structures & Algorithms", "Model Evaluation Metrics"]
            
        deadline_date = (datetime.now() + timedelta(days=deadline_days)).strftime("%Y-%m-%d")
        
        # Structure progressive days
        tasks_to_create = []
        
        # Day 1-2: Foundation & Diagnostic Review of Weak Topics
        for i, weak in enumerate(weaknesses[:2]):
            tasks_to_create.append({
                "day_number": 1,
                "title": f"Diagnostic deep-dive: {weak} core principles",
                "topic": weak,
                "estimated_minutes": int(daily_hours * 30),
                "is_completed": 0
            })
            tasks_to_create.append({
                "day_number": 2,
                "title": f"Practice 10 targeted problems in {weak}",
                "topic": weak,
                "estimated_minutes": int(daily_hours * 30),
                "is_completed": 0
            })
            
        # Day 3: Intermediate application
        tasks_to_create.append({
            "day_number": 3,
            "title": f"Integrate {subject} concepts into mini coding drill",
            "topic": subject,
            "estimated_minutes": int(daily_hours * 45),
            "is_completed": 0
        })
        
        # Day 4: Self-Assessment & Quiz Agent Verification
        tasks_to_create.append({
            "day_number": 4,
            "title": "Complete full-length diagnostic quiz & review explanations",
            "topic": subject,
            "estimated_minutes": int(daily_hours * 40),
            "is_completed": 0
        })
        
        # Day 5: Goal alignment & mini-project
        tasks_to_create.append({
            "day_number": 5,
            "title": f"Apply key learnings toward goal: {target_goal}",
            "topic": subject,
            "estimated_minutes": int(daily_hours * 50),
            "is_completed": 0
        })

        # Persist to database
        conn = get_connection()
        cursor = conn.cursor()
        
        # Mark previous active plans as Completed
        cursor.execute("UPDATE study_plans SET status = 'Archived' WHERE student_id = ? AND status = 'Active'", (student_id,))
        
        cursor.execute("""
            INSERT INTO study_plans (student_id, subject, target_goal, deadline_date, daily_hours, status)
            VALUES (?, ?, ?, ?, ?, 'Active')
        """, (student_id, subject, target_goal, deadline_date, daily_hours))
        plan_id = cursor.lastrowid
        
        db_tasks = []
        for t in tasks_to_create:
            cursor.execute("""
                INSERT INTO study_tasks (plan_id, day_number, title, topic, estimated_minutes, is_completed)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (plan_id, t["day_number"], t["title"], t["topic"], t["estimated_minutes"], t["is_completed"]))
            task_id = cursor.lastrowid
            t_copy = dict(t)
            t_copy["id"] = task_id
            t_copy["plan_id"] = plan_id
            db_tasks.append(t_copy)
            
        conn.commit()
        conn.close()
        
        return {
            "agent": self.name,
            "status": "Success",
            "plan_id": plan_id,
            "subject": subject,
            "target_goal": target_goal,
            "deadline_date": deadline_date,
            "daily_hours": daily_hours,
            "total_tasks": len(db_tasks),
            "tasks": db_tasks,
            "strategy": f"Prioritized identified gap areas ({', '.join(weaknesses)}) in early sessions while maintaining {daily_hours} hrs/day pacing towards {target_goal}."
        }

planner_agent = StudyPlannerAgent()
