"""
LearnMate AI - Machine Learning Component Tests
"""

import pytest
from app.ml.model import predictor

def test_model_loaded_and_predicts():
    assert predictor is not None
    features = {
        "previous_quiz_score": 85.0,
        "recent_quiz_avg": 90.0,
        "practice_completion_rate": 0.85,
        "quiz_attempts_count": 8,
        "study_time_hours": 25.0,
        "performance_trend": 0.35
    }
    result = predictor.predict(features)
    assert "predicted_category" in result
    assert result["predicted_category"] == "Ready for advanced practice"
    assert result["confidence"] > 0.5
    assert "probabilities" in result
    assert "pedagogical_explanation" in result
    assert "ethical_notice" in result

def test_foundational_revision_prediction():
    features = {
        "previous_quiz_score": 35.0,
        "recent_quiz_avg": 40.0,
        "practice_completion_rate": 0.2,
        "quiz_attempts_count": 2,
        "study_time_hours": 3.0,
        "performance_trend": -0.2
    }
    result = predictor.predict(features)
    assert result["predicted_category"] == "Needs foundational revision"
    assert "core concept summaries" in result["recommended_focus"]

def test_model_metrics_structure():
    assert predictor.metrics is not None
    if predictor.metrics:
        assert "primary_model_metrics" in predictor.metrics
        acc = predictor.metrics["primary_model_metrics"]["accuracy"]
        assert 0.70 <= acc <= 1.0
        assert "confusion_matrix" in predictor.metrics
        assert "feature_importances" in predictor.metrics
