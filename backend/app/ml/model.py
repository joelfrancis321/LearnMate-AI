"""
LearnMate AI - ML Predictor Service
Author: LearnMate AI Engineering Team
Provides runtime inference, probability estimation, and transparent explanation for student support tiers.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np

class StudentSupportPredictor:
    def __init__(self, model_path: str = None, metrics_path: str = None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if model_path is None:
            model_path = os.path.join(base_dir, "..", "..", "data", "student_classifier.joblib")
        if metrics_path is None:
            metrics_path = os.path.join(base_dir, "..", "..", "data", "model_metrics.json")
            
        self.model_path = model_path
        self.metrics_path = metrics_path
        self.payload = None
        self.model = None
        self.feature_cols = [
            "previous_quiz_score",
            "recent_quiz_avg",
            "practice_completion_rate",
            "quiz_attempts_count",
            "study_time_hours",
            "performance_trend"
        ]
        self.class_names = [
            "Needs foundational revision",
            "Developing understanding",
            "Ready for advanced practice"
        ]
        self.metrics = {}
        self.load_model()
        
    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.payload = joblib.load(self.model_path)
                self.model = self.payload.get("model")
                self.feature_cols = self.payload.get("feature_cols", self.feature_cols)
                self.class_names = self.payload.get("class_names", self.class_names)
            except Exception as e:
                print(f"[Warning] Failed loading model artifact: {e}")
                self.model = None
                
        if os.path.exists(self.metrics_path):
            try:
                with open(self.metrics_path, "r") as f:
                    self.metrics = json.load(f)
            except Exception as e:
                print(f"[Warning] Failed loading metrics: {e}")

    def predict(self, student_features: dict) -> dict:
        """
        Accepts dictionary containing:
        - previous_quiz_score (float 0-100)
        - recent_quiz_avg (float 0-100)
        - practice_completion_rate (float 0.0-1.0)
        - quiz_attempts_count (int >= 1)
        - study_time_hours (float >= 0)
        - performance_trend (float -1.0 to 1.0)
        """
        # Safe input sanitization
        prev_score = float(student_features.get("previous_quiz_score", 60.0))
        recent_avg = float(student_features.get("recent_quiz_avg", 60.0))
        comp_rate = float(np.clip(student_features.get("practice_completion_rate", 0.5), 0.0, 1.0))
        attempts = int(max(1, student_features.get("quiz_attempts_count", 1)))
        study_hours = float(max(0.0, student_features.get("study_time_hours", 5.0)))
        trend = float(np.clip(student_features.get("performance_trend", 0.0), -1.0, 1.0))
        
        feature_vector = pd.DataFrame([{
            "previous_quiz_score": prev_score,
            "recent_quiz_avg": recent_avg,
            "practice_completion_rate": comp_rate,
            "quiz_attempts_count": attempts,
            "study_time_hours": study_hours,
            "performance_trend": trend
        }])
        
        if self.model is not None:
            pred_class_idx = int(self.model.predict(feature_vector)[0])
            probabilities = self.model.predict_proba(feature_vector)[0]
            confidence = float(np.max(probabilities))
            prob_breakdown = {
                self.class_names[i]: round(float(probabilities[i]), 3)
                for i in range(len(self.class_names))
            }
        else:
            # Deterministic heuristic fallback if model artifact is not yet trained
            heuristic_score = 0.4 * recent_avg + 0.3 * prev_score + 20 * comp_rate + 5 * trend
            if heuristic_score < 50:
                pred_class_idx = 0
            elif heuristic_score < 75:
                pred_class_idx = 1
            else:
                pred_class_idx = 2
            confidence = 0.85
            prob_breakdown = {self.class_names[pred_class_idx]: 0.85}
            
        category_label = self.class_names[pred_class_idx]
        
        # Transparent reasoning & pedagogical explanation
        explanations = []
        if recent_avg < 55:
            explanations.append(f"Recent quiz average ({recent_avg:.1f}%) signals fundamental knowledge gaps.")
        elif recent_avg > 80:
            explanations.append(f"Strong quiz average ({recent_avg:.1f}%) shows firm command over core concepts.")
        else:
            explanations.append(f"Moderate quiz average ({recent_avg:.1f}%) demonstrates active progress.")
            
        if comp_rate < 0.4:
            explanations.append(f"Practice completion rate is low ({comp_rate*100:.0f}%); consistent problem solving will solidify fundamentals.")
        elif comp_rate > 0.75:
            explanations.append(f"High practice completion rate ({comp_rate*100:.0f}%) reflects solid learning discipline.")
            
        if trend > 0.1:
            explanations.append(f"Upward score trend (+{trend:.2f}) indicates that recent review sessions are yielding positive outcomes.")
        elif trend < -0.1:
            explanations.append(f"Slight downward trend ({trend:.2f}) suggests review of prerequisites is required before advancing.")
            
        recommended_focus = {
            "Needs foundational revision": "Focus on core concept summaries, interactive flashcards, and step-by-step tutorial walkthroughs.",
            "Developing understanding": "Practice targeted multiple-choice drills, apply algorithms to mini exercises, and review tricky questions.",
            "Ready for advanced practice": "Tackle challenging synthetic projects, advanced algorithmic problems, and competitive coding quizzes."
        }[category_label]
        
        return {
            "predicted_category": category_label,
            "category_code": pred_class_idx,
            "confidence": round(confidence, 3),
            "probabilities": prob_breakdown,
            "input_features": {
                "previous_quiz_score": prev_score,
                "recent_quiz_avg": recent_avg,
                "practice_completion_rate": comp_rate,
                "quiz_attempts_count": attempts,
                "study_time_hours": study_hours,
                "performance_trend": trend
            },
            "pedagogical_explanation": " ".join(explanations),
            "recommended_focus": recommended_focus,
            "ethical_notice": "This classification is used strictly to recommend personalized educational materials and study pacing. It is not an assessment of general intelligence or potential."
        }

# Global instance
predictor = StudentSupportPredictor()
