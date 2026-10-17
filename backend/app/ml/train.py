"""
LearnMate AI - Machine Learning Training and Evaluation Pipeline
Model: Scikit-Learn RandomForestClassifier & DecisionTreeClassifier
Task: Multi-class Student Support Tier Classification
Classes:
  0: Needs foundational revision
  1: Developing understanding
  2: Ready for advanced practice
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

def train_and_evaluate(data_path: str = None, save_dir: str = None):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if data_path is None:
        data_path = os.path.join(base_dir, "..", "..", "data", "sample_student_features.csv")
    if save_dir is None:
        save_dir = os.path.join(base_dir, "..", "..", "data")
    
    os.makedirs(save_dir, exist_ok=True)
    
    # 1. Load Data
    df = pd.read_csv(data_path)
    feature_cols = [
        "previous_quiz_score",
        "recent_quiz_avg",
        "practice_completion_rate",
        "quiz_attempts_count",
        "study_time_hours",
        "performance_trend"
    ]
    target_col = "support_category_code"
    
    X = df[feature_cols]
    y = df[target_col]
    
    # 2. Train/Test Split (80/20 with stratified sampling and fixed random seed)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # 3. Model 1: Decision Tree (Interpretable baseline)
    dt_model = DecisionTreeClassifier(max_depth=5, random_state=42)
    dt_model.fit(X_train, y_train)
    dt_preds = dt_model.predict(X_test)
    dt_acc = accuracy_score(y_test, dt_preds)
    
    # 4. Model 2: Random Forest (Primary ensemble model)
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    
    # 5. Comprehensive Metrics Computation
    acc = accuracy_score(y_test, rf_preds)
    prec_macro = precision_score(y_test, rf_preds, average="macro")
    recall_macro = recall_score(y_test, rf_preds, average="macro")
    f1_macro = f1_score(y_test, rf_preds, average="macro")
    f1_weighted = f1_score(y_test, rf_preds, average="weighted")
    
    class_names = [
        "Needs foundational revision",
        "Developing understanding",
        "Ready for advanced practice"
    ]
    
    cm = confusion_matrix(y_test, rf_preds).tolist()
    report_dict = classification_report(y_test, rf_preds, target_names=class_names, output_dict=True)
    
    # Feature Importances
    importances = rf_model.feature_importances_
    feature_importance_map = [
        {"feature": feat, "importance": round(float(imp), 4)}
        for feat, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    ]
    
    metrics = {
        "model_name": "Random Forest Classifier",
        "baseline_model": "Decision Tree Classifier",
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "random_state": 42,
        "features": feature_cols,
        "class_labels": class_names,
        "primary_model_metrics": {
            "accuracy": round(float(acc), 4),
            "precision_macro": round(float(prec_macro), 4),
            "recall_macro": round(float(recall_macro), 4),
            "f1_macro": round(float(f1_macro), 4),
            "f1_weighted": round(float(f1_weighted), 4)
        },
        "baseline_metrics": {
            "decision_tree_accuracy": round(float(dt_acc), 4)
        },
        "confusion_matrix": cm,
        "classification_report": report_dict,
        "feature_importances": feature_importance_map,
        "provenance_disclosure": "Trained on synthetic educational trajectory dataset (1,200 samples) calibrated to model realistic student test performance, study pace, and improvement trends."
    }
    
    # 6. Save Model Artifact and Metrics
    model_save_path = os.path.join(save_dir, "student_classifier.joblib")
    metrics_save_path = os.path.join(save_dir, "model_metrics.json")
    
    payload = {
        "model": rf_model,
        "feature_cols": feature_cols,
        "class_names": class_names,
        "metrics": metrics
    }
    joblib.dump(payload, model_save_path)
    
    with open(metrics_save_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"Model saved to: {model_save_path}")
    print(f"Metrics saved to: {metrics_save_path}")
    print(f"Random Forest Accuracy: {acc * 100:.2f}% | F1-Score: {f1_macro:.4f}")
    print(f"Decision Tree Baseline Accuracy: {dt_acc * 100:.2f}%")
    return metrics

if __name__ == "__main__":
    train_and_evaluate()
