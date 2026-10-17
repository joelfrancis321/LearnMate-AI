"""
LearnMate AI - Curated Local Knowledge Base Service
Author: LearnMate AI Engineering Team (BharatCares Internship)

Provides local keyword and TF-IDF semantic retrieval over verified computer science,
machine learning, and Python educational content without calling external paid LLM APIs.
"""

from typing import List, Dict, Any
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

KNOWLEDGE_ENTRIES = [
    {
        "id": "ml_sup_unsup",
        "topic": "Machine Learning Fundamentals",
        "keywords": ["supervised", "unsupervised", "reinforcement", "types of machine learning", "labeled data"],
        "title": "Supervised vs. Unsupervised vs. Reinforcement Learning",
        "content": (
            "Machine learning paradigms differ by how models interact with training data:\n\n"
            "• **Supervised Learning**: The algorithm learns from labeled training pairs `(input, target)`. "
            "Examples include Classification (predicting discrete labels like Spam vs Not Spam) and Regression (predicting continuous real values like house price).\n"
            "• **Unsupervised Learning**: The algorithm analyzes unlabeled data to uncover hidden structures, patterns, or groupings. Common methods are Clustering (K-Means, DBSCAN) and Dimensionality Reduction (PCA, t-SNE).\n"
            "• **Reinforcement Learning**: An autonomous agent learns optimal policies through trial-and-error interaction with an environment, maximizing cumulative rewards (e.g., game playing, robotics navigation)."
        ),
        "code_example": (
            "# Supervised Learning in Scikit-Learn\n"
            "from sklearn.linear_model import LogisticRegression\n"
            "clf = LogisticRegression()\n"
            "clf.fit(X_train, y_train)\n"
            "predictions = clf.predict(X_test)"
        ),
        "key_takeaway": "Choose supervised learning when you have ground-truth historical labels; choose unsupervised when discovering latent groupings."
    },
    {
        "id": "ml_decision_trees",
        "topic": "Machine Learning Fundamentals",
        "keywords": ["decision tree", "random forest", "gini impurity", "information gain", "entropy", "ensemble"],
        "title": "Decision Trees and Random Forests",
        "content": (
            "A **Decision Tree** is a non-parametric supervised learning method that recursively partitions feature space into homogenous regions:\n\n"
            "1. **Splitting Criteria**: At each decision node, the algorithm chooses the feature and split threshold that maximizes purity.\n"
            "   - **Gini Impurity**: `Gini = 1 - sum(p_i^2)`, measuring probability of misclassification.\n"
            "   - **Information Gain / Entropy**: `Entropy = -sum(p_i * log2(p_i))`, measuring information theoretic uncertainty.\n"
            "2. **Overfitting**: Deep unpruned trees suffer from high variance (memorizing training data).\n"
            "3. **Random Forests**: An ensemble of decision trees trained on bootstrap samples (bagging) with random feature subsets at each split. This drastically lowers variance while retaining low bias."
        ),
        "code_example": (
            "from sklearn.ensemble import RandomForestClassifier\n"
            "rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)\n"
            "rf.fit(X_train, y_train)\n"
            "print('Feature Importances:', rf.feature_importances_)"
        ),
        "key_takeaway": "Random Forests reduce variance through bagging and random feature selection, yielding high robustness against overfitting."
    },
    {
        "id": "ml_metrics",
        "topic": "Machine Learning Fundamentals",
        "keywords": ["metrics", "accuracy", "precision", "recall", "f1 score", "confusion matrix", "imbalanced data"],
        "title": "Classification Model Evaluation Metrics",
        "content": (
            "Evaluating classification models requires metrics aligned with class distributions and error costs:\n\n"
            "• **Accuracy**: `(TP + TN) / (TP + TN + FP + FN)`. Reliable only when classes are roughly balanced. Misleading in imbalanced scenarios (e.g. fraud detection).\n"
            "• **Precision**: `TP / (TP + FP)`. Measures what fraction of predicted positives were truly positive (critical when false positives are expensive, e.g. spam filtering).\n"
            "• **Recall (Sensitivity)**: `TP / (TP + FN)`. Measures what fraction of actual positives were successfully detected (critical when false negatives are dangerous, e.g. disease screening).\n"
            "• **F1-Score**: Harmonic mean of Precision and Recall: `2 * (Precision * Recall) / (Precision + Recall)`. Balances both concerns.\n"
            "• **Confusion Matrix**: 2x2 or NxN table displaying TP, FP, TN, and FN counts."
        ),
        "code_example": (
            "from sklearn.metrics import classification_report, confusion_matrix\n"
            "print(confusion_matrix(y_true, y_pred))\n"
            "print(classification_report(y_true, y_pred))"
        ),
        "key_takeaway": "Never rely solely on accuracy for imbalanced datasets; inspect the confusion matrix and F1-score."
    },
    {
        "id": "ml_bias_variance",
        "topic": "Machine Learning Fundamentals",
        "keywords": ["overfitting", "underfitting", "bias variance tradeoff", "regularization", "generalization"],
        "title": "The Bias-Variance Tradeoff: Overfitting vs. Underfitting",
        "content": (
            "Generalization error decomposes into bias, variance, and irreducible noise:\n\n"
            "• **High Bias (Underfitting)**: Model is overly simplistic and cannot capture underlying data trends (e.g. linear model for non-linear data). Leads to high training error and high test error.\n"
            "• **High Variance (Overfitting)**: Model is excessively complex and memorizes noise/peculiarities in the training set. Symptoms: Very low training error, but high validation/test error.\n"
            "• **Remedies for Overfitting**: Cross-validation, regularization (L1/L2), tree pruning, dropout in neural nets, feature selection, collecting more training data."
        ),
        "code_example": (
            "# Mitigating overfitting with L2 Regularization (Ridge / Logistic)\n"
            "from sklearn.linear_model import Ridge\n"
            "reg = Ridge(alpha=1.0) # alpha penalizes large weight coefficients\n"
            "reg.fit(X_train, y_train)"
        ),
        "key_takeaway": "The optimal model achieves a sweet spot minimizing both bias and variance on unseen test data."
    },
    {
        "id": "py_comprehensions",
        "topic": "Python Programming",
        "keywords": ["list comprehension", "generator", "dictionary comprehension", "pythonic", "lambda"],
        "title": "Python List Comprehensions & Generator Expressions",
        "content": (
            "List comprehensions provide a concise, readable syntax for creating new lists from iterables:\n\n"
            "• **Syntax**: `[expression for item in iterable if condition]`\n"
            "• **Performance**: Typically executes faster than standard Python `for` loops due to underlying C-level bytecode optimization.\n"
            "• **Generator Expressions**: Written with parentheses `(expression for item in iterable)`. Computes values lazily on-the-fly, consuming minimal memory for large sequences."
        ),
        "code_example": (
            "# List comprehension with filtering\n"
            "squares = [x**2 for x in range(10) if x % 2 == 0]\n"
            "# Generator for memory efficiency\n"
            "gen = (x * 2 for x in range(1_000_000))\n"
            "print(next(gen)) # 0"
        ),
        "key_takeaway": "Use list comprehensions for concise transformations; switch to generator expressions when processing massive datasets."
    },
    {
        "id": "py_oop",
        "topic": "Python Programming",
        "keywords": ["oop", "classes", "dunder", "__init__", "inheritance", "polymorphism", "encapsulation"],
        "title": "Object-Oriented Programming (OOP) in Python",
        "content": (
            "Python supports object-oriented patterns with first-class classes and objects:\n\n"
            "• **`__init__`**: Constructor method invoked when an object instance is created.\n"
            "• **Encapsulation**: Conventions use single underscore `_var` for protected and double underscore `__var` for private (name mangling).\n"
            "• **Inheritance**: `class Child(Parent):` allows code reuse and specialization.\n"
            "• **Polymorphism**: Common interface with class-specific method implementations."
        ),
        "code_example": (
            "class Student:\n"
            "    def __init__(self, name: str, track: str):\n"
            "        self.name = name\n"
            "        self.track = track\n"
            "    def summary(self) -> str:\n"
            "        return f'{self.name} is learning {self.track}'\n\n"
            "joel = Student('Joel', 'Machine Learning')\n"
            "print(joel.summary())"
        ),
        "key_takeaway": "Classes encapsulate state and behavior, facilitating modular, maintainable software architectures."
    },
    {
        "id": "dsa_trees_graphs",
        "topic": "Data Structures & Algorithms",
        "keywords": ["bfs", "dfs", "binary search tree", "graphs", "breadth first search", "depth first search"],
        "title": "Tree and Graph Traversals: BFS vs. DFS",
        "content": (
            "Traversing non-linear data structures involves systematic visitation strategies:\n\n"
            "• **Breadth-First Search (BFS)**: Uses a **Queue (FIFO)**. Visits all nodes at distance `d` before distance `d+1`. Ideal for finding the shortest path in unweighted graphs.\n"
            "• **Depth-First Search (DFS)**: Uses a **Stack (LIFO)** or recursion. Explores as far down each branch as possible before backtracking. Ideal for topological sorting, cycle detection, and maze solving.\n"
            "• **Time Complexity**: Both run in `O(V + E)` where V is vertices and E is edges."
        ),
        "code_example": (
            "from collections import deque\n"
            "def bfs(graph, start):\n"
            "    visited, queue = set([start]), deque([start])\n"
            "    order = []\n"
            "    while queue:\n"
            "        node = queue.popleft()\n"
            "        order.append(node)\n"
            "        for neighbor in graph[node]:\n"
            "            if neighbor not in visited:\n"
            "                visited.add(neighbor)\n"
            "                queue.append(neighbor)\n"
            "    return order"
        ),
        "key_takeaway": "Use BFS with a FIFO queue for shortest paths in unweighted graphs; use DFS with recursion or a stack for cycle detection."
    },
    {
        "id": "dsa_big_o",
        "topic": "Data Structures & Algorithms",
        "keywords": ["big o", "time complexity", "space complexity", "asymptotic", "hash table", "binary search"],
        "title": "Asymptotic Analysis and Big-O Complexity",
        "content": (
            "Big-O notation describes the limiting behavior of an algorithm as input size `n` grows toward infinity:\n\n"
            "• **O(1) Constant**: Hash map lookup, array index access.\n"
            "• **O(log n) Logarithmic**: Binary search on a sorted array, balanced BST operations.\n"
            "• **O(n) Linear**: Single loop, linear search, unweighted array scan.\n"
            "• **O(n log n) Linearithmic**: MergeSort, QuickSort (average), HeapSort.\n"
            "• **O(n^2) Quadratic**: Nested loops, BubbleSort, SelectionSort.\n"
            "• **O(2^n) Exponential**: Naive recursive Fibonacci, brute force subset generation."
        ),
        "code_example": (
            "# Binary Search: O(log n) time complexity\n"
            "def binary_search(arr, target):\n"
            "    low, high = 0, len(arr) - 1\n"
            "    while low <= high:\n"
            "        mid = (low + high) // 2\n"
            "        if arr[mid] == target: return mid\n"
            "        elif arr[mid] < target: low = mid + 1\n"
            "        else: high = mid - 1\n"
            "    return -1"
        ),
        "key_takeaway": "Always analyze both time and auxiliary space complexity to avoid memory bottlenecks and CPU timeouts."
    }
]

class KnowledgeBaseService:
    def __init__(self):
        self.entries = KNOWLEDGE_ENTRIES
        self.corpus = [
            f"{e['title']} {e['topic']} {' '.join(e['keywords'])} {e['content']}"
            for e in self.entries
        ]
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)

    def search(self, query: str, top_k: int = 2) -> Dict[str, Any]:
        cleaned_query = query.strip().lower()
        if not cleaned_query:
            return {
                "matched": False,
                "response": "Please enter a question regarding Python, Machine Learning, or Data Structures.",
                "sources": []
            }
        
        # 1. Exact / Keyword check
        keyword_matches = []
        for e in self.entries:
            score = 0
            for kw in e["keywords"]:
                if kw in cleaned_query:
                    score += 2
            if any(term in cleaned_query for term in e["title"].lower().split()):
                score += 1
            if score > 0:
                keyword_matches.append((score, e))
                
        if keyword_matches:
            keyword_matches.sort(key=lambda x: x[0], reverse=True)
            best_entry = keyword_matches[0][1]
            return {
                "matched": True,
                "confidence": 0.92,
                "title": best_entry["title"],
                "topic": best_entry["topic"],
                "response": best_entry["content"],
                "code_example": best_entry["code_example"],
                "key_takeaway": best_entry["key_takeaway"],
                "source_id": best_entry["id"],
                "source_attribution": f"Curated LearnMate Local Knowledge Base ({best_entry['topic']})"
            }

        # 2. TF-IDF Cosine Similarity Search
        query_vec = self.vectorizer.transform([cleaned_query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix)[0]
        best_idx = int(similarities.argmax())
        best_sim = float(similarities[best_idx])
        
        if best_sim > 0.15:
            matched_entry = self.entries[best_idx]
            return {
                "matched": True,
                "confidence": round(best_sim, 2),
                "title": matched_entry["title"],
                "topic": matched_entry["topic"],
                "response": matched_entry["content"],
                "code_example": matched_entry["code_example"],
                "key_takeaway": matched_entry["key_takeaway"],
                "source_id": matched_entry["id"],
                "source_attribution": f"Curated LearnMate Local Knowledge Base ({matched_entry['topic']})"
            }
            
        # 3. Transparent Fallback for Out-of-Domain queries
        return {
            "matched": False,
            "confidence": 0.0,
            "title": "Topic Beyond Local Knowledge Base",
            "topic": "General Guidance",
            "response": (
                "I am specialized as the LearnMate AI Academic Tutor in Python Programming, Machine Learning Fundamentals, and Data Structures & Algorithms. "
                "Your question falls outside my curated offline knowledge repository. "
                "Try asking questions such as:\n"
                "• 'What is the difference between supervised and unsupervised learning?'\n"
                "• 'How do Decision Trees split using Gini Impurity?'\n"
                "• 'Explain Precision, Recall, and the F1-Score.'\n"
                "• 'How do Python list comprehensions work?'\n"
                "• 'What is the difference between BFS and DFS?'"
            ),
            "code_example": None,
            "key_takeaway": "LearnMate uses an offline curated index to avoid fabricating unverified external citations.",
            "source_id": "fallback_local",
            "source_attribution": "LearnMate System Fallback Handler"
        }

knowledge_service = KnowledgeBaseService()
