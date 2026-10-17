"""
LearnMate AI - Multi-Agent Workflow Tests
"""

import pytest
from app.agents.tutor_agent import tutor_agent
from app.agents.quiz_agent import quiz_agent
from app.agents.analyst_agent import analyst_agent
from app.agents.planner_agent import planner_agent
from app.agents.career_agent import career_agent
from app.agents.orchestrator import orchestrator
from app.db import seed_database

@pytest.fixture(autouse=True)
def prepare_db():
    seed_database(force=False)

def test_tutor_agent_retrieval():
    res = tutor_agent.execute("What is supervised learning?")
    assert res["status"] == "Success"
    assert res["matched"] is True
    assert "Supervised" in res["explanation"]
    assert res["code_snippet"] is not None

def test_tutor_agent_fallback():
    res = tutor_agent.execute("How do I bake sourdough bread?")
    assert res["matched"] is False
    assert "offline" in res["key_takeaway"].lower() or "curated" in res["explanation"].lower()

def test_quiz_agent_question_generation():
    res = quiz_agent.get_questions_for_topic("python_prog")
    assert res["status"] == "Success"
    assert len(res["questions"]) == 5
    first_q = res["questions"][0]
    assert "options" in first_q
    assert "A" in first_q["options"]

def test_analyst_agent():
    analysis = analyst_agent.analyze_student("STU_DEMO_01")
    assert analysis["status"] == "Success"
    assert "ml_support_tier" in analysis
    assert len(analysis["subject_mastery"]) > 0

def test_planner_agent():
    plan = planner_agent.generate_plan(
        student_id="STU_DEMO_01",
        subject="Python & AI Mastery",
        target_goal="Crack Mid-term Exam",
        daily_hours=2.0,
        weaknesses=["Data Structures & Algorithms"]
    )
    assert plan["status"] == "Success"
    assert plan["total_tasks"] > 0
    assert len(plan["tasks"]) > 0

def test_career_agent():
    res = career_agent.recommend("ai_ml_engineer", ["Python Programming"])
    assert res["status"] == "Success"
    assert "AI / Machine Learning Engineer" in res["career_goal"]
    assert len(res["core_skills"]) >= 3

def test_orchestrator_composite_workflow():
    result = orchestrator.execute_workflow(
        request_text="Diagnose my weak areas and build me a study blueprint",
        student_id="STU_DEMO_01"
    )
    assert result["execution_status"] in ["Success", "Partial Success (Fallback)"]
    assert len(result["steps"]) >= 3
    assert len(result["agents_involved"]) >= 2
    assert "analyst" in [s["agent_name"].lower() for s in result["steps"]] or any("analyst" in s["agent_name"].lower() for s in result["steps"])
