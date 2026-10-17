"""
LearnMate AI - SQLite Database Initialization & Access Layer
"""

import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "learnmate.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Student Profile
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_profile (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        current_semester TEXT DEFAULT '6th Semester - B.Tech CSE',
        target_goal TEXT DEFAULT 'AI/ML Software Engineer',
        daily_study_hours REAL DEFAULT 2.5,
        streak_days INTEGER DEFAULT 7,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 2. Quiz Topics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_topics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        badge TEXT NOT NULL,
        total_questions INTEGER DEFAULT 5
    );
    """)
    
    # 3. Quiz Questions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        explanation TEXT NOT NULL,
        FOREIGN KEY (topic_id) REFERENCES quiz_topics(id)
    );
    """)
    
    # 4. Quiz Attempts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        topic_title TEXT NOT NULL,
        score REAL NOT NULL,
        correct_count INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_spent_seconds INTEGER NOT NULL,
        answers_json TEXT,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 5. Study Plans
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        target_goal TEXT NOT NULL,
        deadline_date TEXT NOT NULL,
        daily_hours REAL NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 6. Study Tasks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        day_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        topic TEXT NOT NULL,
        estimated_minutes INTEGER NOT NULL,
        is_completed INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES study_plans(id)
    );
    """)
    
    # 7. Agent Orchestration Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_text TEXT NOT NULL,
        workflow_type TEXT NOT NULL,
        agents_involved_json TEXT NOT NULL,
        task_plan_json TEXT NOT NULL,
        execution_status TEXT NOT NULL,
        result_json TEXT NOT NULL,
        fallback_used INTEGER DEFAULT 0,
        latency_ms INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 8. Recommendation History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        title TEXT NOT NULL,
        topic TEXT NOT NULL,
        reason TEXT NOT NULL,
        action_type TEXT NOT NULL,
        priority TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    conn.commit()
    conn.close()

def seed_database(force: bool = False):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if student exists
    cursor.execute("SELECT COUNT(*) FROM student_profile")
    has_student = cursor.fetchone()[0] > 0
    
    if force or not has_student:
        cursor.execute("DELETE FROM student_profile")
        cursor.execute("DELETE FROM quiz_topics")
        cursor.execute("DELETE FROM quiz_questions")
        cursor.execute("DELETE FROM quiz_attempts")
        cursor.execute("DELETE FROM study_plans")
        cursor.execute("DELETE FROM study_tasks")
        cursor.execute("DELETE FROM agent_logs")
        cursor.execute("DELETE FROM recommendations")
        
        # 1. Student Profile
        cursor.execute("""
        INSERT INTO student_profile (id, name, email, current_semester, target_goal, daily_study_hours, streak_days)
        VALUES ('STU_DEMO_01', 'Joel Francis', 'joel.francis@example.edu', '6th Semester - B.Tech CSE', 'AI/ML Software Engineer', 2.5, 9)
        """)
        
        # 2. Quiz Topics
        topics = [
            ("python_prog", "Python Programming", "Core Programming", "Master language fundamentals, data types, control flow, functions, and list comprehensions.", "Foundation", 5),
            ("ml_fundamentals", "Machine Learning Fundamentals", "Applied AI", "Explore supervised learning, classification vs regression, decision trees, and metrics.", "Core ML", 5),
            ("dsa_core", "Data Structures & Algorithms", "Computer Science", "Understand arrays, hash maps, binary trees, recursion, and time complexity analysis.", "Algorithms", 5)
        ]
        cursor.executemany("INSERT INTO quiz_topics VALUES (?, ?, ?, ?, ?, ?)", topics)
        
        # 3. Quiz Questions (high quality, genuine computer science & AI questions)
        questions = [
            # Python
            ("python_prog", "What is the output of `[x**2 for x in range(5) if x % 2 != 0]` in Python?",
             "[0, 4, 16]", "[1, 9]", "[1, 4, 9]", "[0, 1, 9]", "B",
             "Range(5) generates 0, 1, 2, 3, 4. The odd numbers are 1 and 3. Their squares are 1**2=1 and 3**2=9, so `[1, 9]` is returned."),
            
            ("python_prog", "In Python, which built-in data type is immutable?",
             "List", "Dictionary", "Tuple", "Set", "C",
             "Tuples in Python are immutable sequence data structures. Once created, their items cannot be modified, re-ordered, or deleted."),
             
            ("python_prog", "What does the `*args` parameter in a function definition do?",
             "Requires keyword arguments only", "Allows passing a variable number of positional arguments as a tuple", "Unpacks dictionary key-value pairs", "Forces type checking", "B",
             "`*args` collects arbitrary extra positional arguments passed to the function into a tuple."),
             
            ("python_prog", "What is the time complexity of looking up a key in a standard Python dictionary on average?",
             "O(n)", "O(log n)", "O(1)", "O(n log n)", "C",
             "Python dictionaries are implemented using hash tables, giving average-case O(1) amortized lookup, insertion, and deletion."),
             
            ("python_prog", "Which method is called automatically when an object is instantiated in Python?",
             "__call__", "__str__", "__init__", "__new__", "C",
             "The `__init__` method initializes the newly created instance of a class."),

            # Machine Learning
            ("ml_fundamentals", "Which type of machine learning problem is predicting a continuous numeric value like house price?",
             "Classification", "Clustering", "Regression", "Dimensionality Reduction", "C",
             "Regression algorithms predict continuous real-valued quantities, whereas classification predicts discrete category labels."),
             
            ("ml_fundamentals", "What metric is most suitable for evaluating a classification model on an imbalanced dataset?",
             "Accuracy", "F1-Score / PR-AUC", "Mean Squared Error", "R-squared", "B",
             "Accuracy is misleading when classes are severely imbalanced. F1-Score (harmonic mean of precision and recall) evaluates minority class performance reliably."),
             
            ("ml_fundamentals", "In a Decision Tree, which criterion is commonly used to measure impurity when splitting nodes?",
             "Gini Impurity or Information Gain (Entropy)", "L1 Regularization", "Euclidean Distance", "Gradient Descent", "A",
             "Decision trees use Gini Impurity (CART) or Information Gain / Entropy (ID3/C4.5) to determine the split that minimizes uncertainty."),
             
            ("ml_fundamentals", "What happens when a machine learning model exhibits very high training accuracy but poor test accuracy?",
             "Underfitting", "Overfitting (high variance)", "High bias", "Zero gradient", "B",
             "Overfitting occurs when the model memorizes noise and idiosyncrasies in the training set rather than generalizing, leading to high test error."),
             
            ("ml_fundamentals", "Why do we perform a train-test split rather than evaluating on training data?",
             "To speed up training", "To test real generalization capability and avoid data leakage", "Because scikit-learn requires it", "To reduce dataset size", "B",
             "Evaluating on unseen test data provides an unbiased assessment of the model's ability to generalize to new, real-world data points."),

            # DSA
            ("dsa_core", "What is the worst-case time complexity of QuickSort?",
             "O(n)", "O(n log n)", "O(n^2)", "O(2^n)", "C",
             "QuickSort has an average complexity of O(n log n), but in the worst case (e.g. already sorted array with poor pivot selection), it degrades to O(n^2)."),
             
            ("dsa_core", "Which data structure follows the First-In, First-Out (FIFO) principle?",
             "Stack", "Queue", "Binary Search Tree", "Max-Heap", "B",
             "Queues process elements strictly in First-In, First-Out (FIFO) sequence, matching queue-like buffering and BFS traversals."),
             
            ("dsa_core", "What is the average time complexity to search for an element in a balanced Binary Search Tree (BST)?",
             "O(1)", "O(log n)", "O(n)", "O(n log n)", "B",
             "In a balanced BST, each comparison halves the remaining search space, yielding O(log n) average time complexity."),
             
            ("dsa_core", "Which algorithm is commonly used to find the shortest path in an unweighted graph?",
             "Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Kruskal's Algorithm", "Binary Search", "B",
             "Breadth-First Search (BFS) traverses nodes level by level, ensuring that the shortest path in an unweighted graph is discovered first."),
             
            ("dsa_core", "What technique uses a hash function to map keys to positions in an array for quick lookup?",
             "Hashing / Hash Table", "Radix Sorting", "Divide and Conquer", "Dynamic Programming", "A",
             "Hashing converts keys into array indices using a hash function, facilitating O(1) average lookup and insertion.")
        ]
        
        cursor.executemany("""
        INSERT INTO quiz_questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, questions)
        
        # 4. Realistic historical quiz attempts for Joel Francis
        now = datetime.now()
        attempts = [
            ("STU_DEMO_01", "python_prog", "Python Programming", 80.0, 4, 5, 140, "{}", (now - timedelta(days=6)).isoformat()),
            ("STU_DEMO_01", "dsa_core", "Data Structures & Algorithms", 60.0, 3, 5, 210, "{}", (now - timedelta(days=4)).isoformat()),
            ("STU_DEMO_01", "ml_fundamentals", "Machine Learning Fundamentals", 60.0, 3, 5, 180, "{}", (now - timedelta(days=2)).isoformat()),
            ("STU_DEMO_01", "python_prog", "Python Programming", 100.0, 5, 5, 120, "{}", (now - timedelta(days=1)).isoformat()),
            ("STU_DEMO_01", "ml_fundamentals", "Machine Learning Fundamentals", 80.0, 4, 5, 160, "{}", now.isoformat())
        ]
        cursor.executemany("""
        INSERT INTO quiz_attempts (student_id, topic_id, topic_title, score, correct_count, total_questions, time_spent_seconds, answers_json, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, attempts)
        
        # 5. Study Plan
        cursor.execute("""
        INSERT INTO study_plans (student_id, subject, target_goal, deadline_date, daily_hours, status)
        VALUES ('STU_DEMO_01', 'Applied AI & Python Mastery', 'Crack Technical AI Interview', '2026-11-15', 2.5, 'Active')
        """)
        plan_id = cursor.lastrowid
        
        tasks = [
            (plan_id, 1, "Review Supervised vs Unsupervised Learning & Metrics", "Machine Learning Fundamentals", 45, 1, (now - timedelta(days=2)).isoformat()),
            (plan_id, 1, "Solve 5 Python List Comprehension & Generator Exercises", "Python Programming", 45, 1, (now - timedelta(days=2)).isoformat()),
            (plan_id, 2, "Study Decision Trees, Gini Impurity, and Information Gain", "Machine Learning Fundamentals", 60, 1, (now - timedelta(days=1)).isoformat()),
            (plan_id, 2, "Implement QuickSort and analyze worst-case behavior", "Data Structures & Algorithms", 45, 1, (now - timedelta(days=1)).isoformat()),
            (plan_id, 3, "Inspect Confusion Matrix, Precision, Recall, and F1 tradeoffs", "Machine Learning Fundamentals", 50, 0, None),
            (plan_id, 3, "Complete Graph BFS Shortest Path coding challenge", "Data Structures & Algorithms", 55, 0, None),
            (plan_id, 4, "Train Scikit-Learn Random Forest on classification dataset", "Machine Learning Fundamentals", 60, 0, None),
            (plan_id, 4, "Build Python FastAPI microservice endpoint", "Python Programming", 50, 0, None)
        ]
        cursor.executemany("""
        INSERT INTO study_tasks (plan_id, day_number, title, topic, estimated_minutes, is_completed, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, tasks)
        
        # 6. Pre-seeded Agent Orchestrator Log
        agent_exec_log = {
            "orchestrator_summary": "Diagnostic assessment triggered for student Joel Francis. Coordinated Learning Analyst, Tutor, and Study Planner agents.",
            "workflow_steps": [
                {"agent": "Learning Analyst", "action": "Calculated subject mastery: Python (90%), ML (70%), DSA (60%). Identified DSA recursion & graph theory as priority gap.", "status": "Completed"},
                {"agent": "Tutor Agent", "action": "Retrieved curated explanations for BFS traversal and Decision Tree Gini impurity calculation.", "status": "Completed"},
                {"agent": "Study Planner Agent", "action": "Formulated 4-day adaptive study sprint allocating 2.5 hrs/day prioritizing DSA and ML metrics.", "status": "Completed"}
            ]
        }
        cursor.execute("""
        INSERT INTO agent_logs (request_text, workflow_type, agents_involved_json, task_plan_json, execution_status, result_json, fallback_used, latency_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Analyze my quiz history and create a targeted review sprint for my weak areas",
            "Multi-Agent Diagnostic & Plan",
            json.dumps(["Learning Analyst Agent", "Tutor Agent", "Study Planner Agent"]),
            json.dumps(["Analyze quiz history", "Retrieve foundational review concepts", "Construct adaptive study sprint"]),
            "Success",
            json.dumps(agent_exec_log),
            0,
            142
        ))
        
        # 7. Recommendations
        recommendations = [
            ("STU_DEMO_01", "Reinforce BFS & Tree Traversals", "Data Structures & Algorithms", "Your DSA quiz score is currently at 60%. Reviewing BFS queue operations will boost your algorithmic confidence.", "Practice Drill", "High", 0),
            ("STU_DEMO_01", "Master Model Evaluation Tradeoffs", "Machine Learning Fundamentals", "Recent quiz shows minor uncertainty on Precision vs Recall for imbalanced datasets.", "Conceptual Review", "Medium", 0),
            ("STU_DEMO_01", "Advanced Python Decorators & Context Managers", "Python Programming", "You achieved 100% on recent Python quiz! Ready to explore intermediate-to-advanced software patterns.", "Advanced Challenge", "Low", 0)
        ]
        cursor.executemany("""
        INSERT INTO recommendations (student_id, title, topic, reason, action_type, priority, is_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, recommendations)
        
        conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_database(force=True)
    print("Database initialized and seeded successfully at:", DB_PATH)
