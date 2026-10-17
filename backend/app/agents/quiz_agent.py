"""
LearnMate AI - Quiz Agent
Role: Generates or selects topic-specific diagnostic questions, validates answers, and returns explanatory feedback.
"""

from typing import Dict, Any, List
from app.db import get_connection

class QuizAgent:
    def __init__(self):
        self.name = "Quiz Agent"
        self.role = "Assessment Generator & Answer Evaluator"

    def get_questions_for_topic(self, topic_id: str, limit: int = 5) -> Dict[str, Any]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation
            FROM quiz_questions
            WHERE topic_id = ?
            LIMIT ?
        """, (topic_id, limit))
        rows = cursor.fetchall()
        conn.close()
        
        questions = []
        for r in rows:
            questions.append({
                "id": r["id"],
                "topic_id": r["topic_id"],
                "question_text": r["question_text"],
                "options": {
                    "A": r["option_a"],
                    "B": r["option_b"],
                    "C": r["option_c"],
                    "D": r["option_d"],
                },
                "correct_option": r["correct_option"],
                "explanation": r["explanation"]
            })
            
        return {
            "agent": self.name,
            "status": "Success",
            "topic_id": topic_id,
            "count": len(questions),
            "questions": questions
        }

    def evaluate_submission(self, student_id: str, topic_id: str, user_answers: Dict[str, str], time_spent_sec: int = 120) -> Dict[str, Any]:
        """
        user_answers: dict of {str(question_id): 'A' | 'B' | 'C' | 'D'}
        """
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, topic_id, question_text, correct_option, explanation FROM quiz_questions WHERE topic_id = ?", (topic_id,))
        rows = cursor.fetchall()
        
        cursor.execute("SELECT title FROM quiz_topics WHERE id = ?", (topic_id,))
        topic_row = cursor.fetchone()
        topic_title = topic_row["title"] if topic_row else topic_id
        
        total = len(rows)
        correct_count = 0
        detailed_review = []
        
        for r in rows:
            qid = str(r["id"])
            user_opt = user_answers.get(qid, "").upper()
            is_correct = (user_opt == r["correct_option"].upper())
            if is_correct:
                correct_count += 1
            detailed_review.append({
                "question_id": r["id"],
                "question_text": r["question_text"],
                "selected_option": user_opt,
                "correct_option": r["correct_option"],
                "is_correct": is_correct,
                "explanation": r["explanation"]
            })
            
        score_percent = round((correct_count / total * 100.0) if total > 0 else 0.0, 1)
        
        # Save to database
        import json
        cursor.execute("""
            INSERT INTO quiz_attempts (student_id, topic_id, topic_title, score, correct_count, total_questions, time_spent_seconds, answers_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (student_id, topic_id, topic_title, score_percent, correct_count, total, time_spent_sec, json.dumps(user_answers)))
        attempt_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Performance summary
        if score_percent >= 80:
            summary = "Excellent mastery! Ready for advanced algorithmic implementation."
        elif score_percent >= 60:
            summary = "Solid core foundation with minor review needed on nuanced scenarios."
        else:
            summary = "Knowledge gaps identified. Foundational review and targeted flashcards advised."
            
        return {
            "agent": self.name,
            "status": "Success",
            "attempt_id": attempt_id,
            "topic_id": topic_id,
            "topic_title": topic_title,
            "score": score_percent,
            "correct_count": correct_count,
            "total_questions": total,
            "summary": summary,
            "detailed_review": detailed_review
        }

quiz_agent = QuizAgent()
