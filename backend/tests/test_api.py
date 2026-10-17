"""
LearnMate AI - FastAPI Endpoints Integration Tests
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import seed_database

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    seed_database(force=True)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ml_engine"] == "scikit-learn (RandomForestClassifier)"

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary/STU_DEMO_01")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "weekly_activity" in data
    assert "recommendations" in data

def test_quiz_topics_and_submit():
    # 1. Fetch topics
    topics_res = client.get("/api/quiz/topics")
    assert topics_res.status_code == 200
    topics = topics_res.json()["topics"]
    assert len(topics) >= 3
    
    # 2. Fetch specific topic
    t_res = client.get("/api/quiz/topic/python_prog")
    assert t_res.status_code == 200
    questions = t_res.json()["questions"]
    assert len(questions) == 5
    
    # 3. Submit quiz
    sub_res = client.post("/api/quiz/submit", json={
        "student_id": "STU_DEMO_01",
        "topic_id": "python_prog",
        "user_answers": {
            str(questions[0]["id"]): questions[0]["correct_option"],
            str(questions[1]["id"]): questions[1]["correct_option"]
        },
        "time_spent_seconds": 95
    })
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["score"] >= 40.0
    assert len(sub_data["detailed_review"]) == 5

def test_ml_prediction_endpoint():
    payload = {
        "previous_quiz_score": 82.0,
        "recent_quiz_avg": 85.0,
        "practice_completion_rate": 0.8,
        "quiz_attempts_count": 6,
        "study_time_hours": 18.0,
        "performance_trend": 0.2
    }
    response = client.post("/api/ml/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_category"] == "Ready for advanced practice"
    assert "confidence" in data
    assert "probabilities" in data

def test_ml_model_info():
    response = client.get("/api/ml/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "primary_model_metrics" in data
    assert "provenance_disclosure" in data

def test_tutor_query():
    response = client.post("/api/tutor/query", json={"query": "Explain Precision and Recall"})
    assert response.status_code == 200
    data = response.json()
    assert data["matched"] is True
    assert "Precision" in data["explanation"]

def test_planner_endpoints():
    # 1. Fetch active
    res = client.get("/api/planner/active/STU_DEMO_01")
    assert res.status_code == 200
    data = res.json()
    assert data["has_plan"] is True
    assert len(data["tasks"]) > 0
    first_task_id = data["tasks"][0]["id"]
    
    # 2. Toggle task
    toggle_res = client.post("/api/planner/toggle-task", json={
        "task_id": first_task_id,
        "is_completed": True
    })
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_completed"] is True

def test_agent_orchestrator_execution():
    payload = {
        "request_text": "Analyze my quiz scores and create a study plan",
        "student_id": "STU_DEMO_01"
    }
    response = client.post("/api/agents/execute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "steps" in data
    assert len(data["steps"]) >= 2
