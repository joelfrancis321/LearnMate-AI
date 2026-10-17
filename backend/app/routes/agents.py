"""
LearnMate AI - Multi-Agent Orchestration API Route
"""

from fastapi import APIRouter
from app.agents.orchestrator import orchestrator
from app.schemas.models import AgentWorkflowRequest
from app.db import get_connection
import json

router = APIRouter(prefix="/api/agents", tags=["Multi-Agent Orchestrator"])

@router.post("/execute")
def execute_agent_workflow(payload: AgentWorkflowRequest):
    result = orchestrator.execute_workflow(
        request_text=payload.request_text,
        student_id=payload.student_id,
        params=payload.params
    )
    return result

@router.get("/logs")
def get_agent_logs(limit: int = 15):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, request_text, workflow_type, agents_involved_json, task_plan_json, execution_status, result_json, fallback_used, latency_ms, created_at
        FROM agent_logs
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    logs = []
    for r in rows:
        try:
            res_obj = json.loads(r["result_json"])
        except:
            res_obj = {}
        logs.append({
            "id": r["id"],
            "request_text": r["request_text"],
            "workflow_type": r["workflow_type"],
            "agents_involved": json.loads(r["agents_involved_json"]) if r["agents_involved_json"] else [],
            "task_plan": json.loads(r["task_plan_json"]) if r["task_plan_json"] else [],
            "execution_status": r["execution_status"],
            "fallback_used": bool(r["fallback_used"]),
            "latency_ms": r["latency_ms"],
            "created_at": r["created_at"],
            "result_details": res_obj
        })
    return {"logs": logs}

@router.get("/catalog")
def get_agent_catalog():
    return {
        "orchestrator": {
            "name": "Master Agent Orchestrator",
            "description": "Receives natural language commands, generates task dependency graphs, routes subtasks to specialized agents, pipes intermediate outputs, monitors fallbacks, and records execution audit trails."
        },
        "agents": [
            {
                "id": "tutor",
                "name": "Tutor Agent",
                "role": "Academic Explainer & Concept Tutor",
                "description": "Explains foundational concepts in plain language, supplies code implementations, and grounds answers in the verified local knowledge base.",
                "capabilities": ["Curated Knowledge Retrieval", "Code Pattern Extraction", "Key Takeaways"]
            },
            {
                "id": "quiz",
                "name": "Quiz Agent",
                "role": "Assessment Generator & Answer Evaluator",
                "description": "Generates diagnostic quizzes, scores student answers, validates options, and provides immediate conceptual feedback.",
                "capabilities": ["Dynamic Question Selection", "Answer Scoring", "Explanatory Feedback"]
            },
            {
                "id": "analyst",
                "name": "Learning Analyst Agent",
                "role": "Performance Diagnostics & Learning Analytics",
                "description": "Reviews historical quiz attempts, computes mastery velocity, flags knowledge gaps, and queries the trained Scikit-Learn classifier.",
                "capabilities": ["Weakness Identification", "Mastery Calculation", "ML Support Tier Inference"]
            },
            {
                "id": "planner",
                "name": "Study Planner Agent",
                "role": "Adaptive Curriculum & Study Schedule Architect",
                "description": "Formulates milestone-driven study schedules allocating daily hours toward priority weak topics and milestone targets.",
                "capabilities": ["Schedule Synthesis", "Prioritization Logic", "Interactive Task Checklists"]
            },
            {
                "id": "career",
                "name": "Career Guide Agent",
                "role": "Career Pathway & Industry Skill Strategist",
                "description": "Maps student competencies and demonstrated strengths to technical career tracks, portfolio capstone projects, and industry skills.",
                "capabilities": ["Career Track Mapping", "Capstone Project Ideation", "Skill Gap Roadmaps"]
            }
        ]
    }
