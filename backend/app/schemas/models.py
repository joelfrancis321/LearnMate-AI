"""
LearnMate AI - Pydantic Request & Response Schemas
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

# ML Schemas
class MLPredictRequest(BaseModel):
    previous_quiz_score: float = Field(..., ge=0, le=100, description="Previous quiz score percentage (0-100)")
    recent_quiz_avg: float = Field(..., ge=0, le=100, description="Recent quiz average percentage (0-100)")
    practice_completion_rate: float = Field(..., ge=0.0, le=1.0, description="Rate of completed practice tasks (0.0 - 1.0)")
    quiz_attempts_count: int = Field(..., ge=1, description="Total quiz attempts count")
    study_time_hours: float = Field(..., ge=0, description="Total cumulative study hours")
    performance_trend: float = Field(..., ge=-1.0, le=1.0, description="Performance trajectory trend (-1.0 to 1.0)")

class MLPredictResponse(BaseModel):
    predicted_category: str
    category_code: int
    confidence: float
    probabilities: Dict[str, float]
    input_features: Dict[str, Any]
    pedagogical_explanation: str
    recommended_focus: str
    ethical_notice: str

# Quiz Schemas
class QuizSubmissionRequest(BaseModel):
    student_id: str = "STU_DEMO_01"
    topic_id: str
    user_answers: Dict[str, str]
    time_spent_seconds: int = 120

# Tutor Schemas
class TutorQueryRequest(BaseModel):
    query: str

# Study Plan Schemas
class PlanCreateRequest(BaseModel):
    student_id: str = "STU_DEMO_01"
    subject: str = "Machine Learning & Python"
    target_goal: str = "Semester Exams & Internship Prep"
    deadline_days: int = 14
    daily_hours: float = 2.5
    weaknesses: Optional[List[str]] = None

class TaskToggleRequest(BaseModel):
    task_id: int
    is_completed: bool

# Agent Workflow Schemas
class AgentWorkflowRequest(BaseModel):
    request_text: str
    student_id: str = "STU_DEMO_01"
    params: Optional[Dict[str, Any]] = None
