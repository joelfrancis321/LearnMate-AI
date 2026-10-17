"""
LearnMate AI - Synthetic Dataset Generator
Author: LearnMate AI Engineering Team (BharatCares ML & Applied AI Internship)

Data Provenance Disclosure:
This dataset is synthetically generated to model realistic student learning behaviors 
and performance trajectories for educational classification. It is generated using 
domain-grounded distributions with realistic noise to evaluate student support categories:
  - Class 0: Needs foundational revision
  - Class 1: Developing understanding
  - Class 2: Ready for advanced practice
"""

import numpy as np
import pandas as pd
import os

def generate_student_dataset(n_samples: int = 1200, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    
    # 1. Previous quiz scores (normal distribution centered around 65)
    previous_quiz_score = np.clip(np.random.normal(65, 18, n_samples), 15, 100)
    
    # 2. Practice completion rate (correlated with previous quiz score)
    completion_noise = np.random.uniform(-0.15, 0.15, n_samples)
    practice_completion_rate = np.clip((previous_quiz_score / 110.0) + completion_noise, 0.05, 1.0)
    
    # 3. Quiz attempts count (1 to 14)
    quiz_attempts_count = np.random.poisson(lam=4, size=n_samples) + 1
    quiz_attempts_count = np.clip(quiz_attempts_count, 1, 15)
    
    # 4. Study time in hours (correlated with attempts and completion)
    study_time_hours = np.clip(quiz_attempts_count * 2.5 + practice_completion_rate * 12 + np.random.normal(5, 3, n_samples), 1.0, 55.0)
    
    # 5. Performance trend (-0.8 to +0.8)
    # Higher study time and practice usually yield positive trend
    performance_trend = np.clip(
        (practice_completion_rate - 0.5) * 0.8 + (study_time_hours / 60.0) * 0.4 + np.random.normal(0, 0.2, n_samples),
        -0.85, 0.85
    )
    
    # 6. Recent quiz average (influenced by previous score + trend)
    recent_quiz_avg = np.clip(previous_quiz_score + (performance_trend * 25.0) + np.random.normal(0, 4, n_samples), 10, 100)
    
    # Target categorization logic based on multi-factor composite index:
    # composite_score ranges roughly 0 to 100
    composite_score = (
        0.35 * recent_quiz_avg +
        0.25 * previous_quiz_score +
        0.20 * (practice_completion_rate * 100) +
        0.10 * np.clip(study_time_hours * 2.0, 0, 100) +
        0.10 * ((performance_trend + 0.85) / 1.7 * 100)
    )
    
    # Assign target labels with realistic boundary softness (noise)
    labels = []
    target_names = []
    for comp in composite_score:
        noisy_comp = comp + np.random.normal(0, 2.5)
        if noisy_comp < 52.0:
            labels.append(0)
            target_names.append("Needs foundational revision")
        elif noisy_comp < 76.0:
            labels.append(1)
            target_names.append("Developing understanding")
        else:
            labels.append(2)
            target_names.append("Ready for advanced practice")
            
    df = pd.DataFrame({
        "student_id": [f"STU_{1000 + i}" for i in range(n_samples)],
        "previous_quiz_score": np.round(previous_quiz_score, 1),
        "recent_quiz_avg": np.round(recent_quiz_avg, 1),
        "practice_completion_rate": np.round(practice_completion_rate, 2),
        "quiz_attempts_count": quiz_attempts_count,
        "study_time_hours": np.round(study_time_hours, 1),
        "performance_trend": np.round(performance_trend, 2),
        "support_category_code": labels,
        "support_category_label": target_names
    })
    
    return df

if __name__ == "__main__":
    output_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "sample_student_features.csv")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df = generate_student_dataset(1200, 42)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} synthetic student records saved to {output_path}")
    print("Class distribution:")
    print(df["support_category_label"].value_counts())
