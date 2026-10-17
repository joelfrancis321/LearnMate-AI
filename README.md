# LearnMate AI

> **Your Personal AI Learning and Student Success Companion**  
> **Organization:** BharatCares  
> **Program:** Machine Learning & Applied AI Internship  
> **Internship Duration:** 24 August – 30 September 2026  
> **Project Theme:** Machine Learning, Applied AI, and Agentic Multi-Agent Systems  
> **Sustainable Development Goal:** UN SDG 4 — Quality Education  
> **Candidate:** Joel Francis (3rd Year, B.Tech Computer Science Engineering)

---

## 1. Project Overview

**LearnMate AI** is an intelligent, offline-capable learning companion that diagnoses student knowledge gaps, estimates personalized learning support tiers using genuine Scikit-Learn machine learning, recommends targeted study activities, and coordinates five specialized local AI agents for academic tutoring, diagnostic assessments, study planning, progress analytics, and career roadmapping.

The project is built specifically to address the challenges faced by engineering students in resource-constrained educational environments (such as Tier-2 and Tier-3 institutions) where personal 1-on-1 tutoring is unaffordable and commercial AI tools impose costly recurring API subscriptions.

### UN SDG 4: Quality Education Alignment
By functioning **100% locally without paid API keys** (no OpenAI, Anthropic, or cloud database fees required), LearnMate AI democratizes high-quality, continuous academic mentorship and study habit tracking for all students.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts (responsive data visualizations).
- **Backend API:** Python 3.12, FastAPI, Pydantic v2, Uvicorn (asynchronous REST API with auto-generated Swagger UI).
- **Machine Learning:** Scikit-Learn (`RandomForestClassifier` and `DecisionTreeClassifier`), Pandas, NumPy, Joblib serialization.
- **Persistence:** SQLite3 embedded relational database for zero-configuration, persistent local storage.
- **Deliverables Generation:** ReportLab (vector PDF generation) and Python-PPTX (editable 16:9 presentation deck).

---

## 3. Project Directory Structure

```
learnmate-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app with CORS, Lifespan, and Deliverable routes
│   │   ├── db.py                # SQLite schema definition and initial demo seed
│   │   ├── routes/              # Modular API controllers
│   │   │   ├── dashboard.py     # KPI summaries and demo data reset
│   │   │   ├── quiz.py          # Topics, questions, and submission evaluation
│   │   │   ├── ml.py            # Real-time ML inference & model metadata
│   │   │   ├── tutor.py         # Curated knowledge retrieval & prompts
│   │   │   ├── planner.py       # Active study plan & task checklists
│   │   │   ├── progress.py      # Analytics, before/after gain comparisons
│   │   │   └── agents.py        # Multi-agent orchestrator execution & logs
│   │   ├── services/
│   │   │   ├── knowledge_base.py# Local TF-IDF search across verified CS cards
│   │   │   └── recommender.py   # Adaptive rule & ML recommendation engine
│   │   ├── agents/
│   │   │   ├── orchestrator.py  # Master Orchestrator (planning & execution)
│   │   │   ├── tutor_agent.py   # Academic concept explainer & code patterns
│   │   │   ├── quiz_agent.py    # Diagnostic question generation & scoring
│   │   │   ├── analyst_agent.py # Mastery velocity & ML feature extraction
│   │   │   ├── planner_agent.py # Adaptive curriculum & 5-day schedule architect
│   │   │   └── career_agent.py  # Tech career pathways & capstone roadmaps
│   │   ├── ml/
│   │   │   ├── synthetic_data_gen.py # Synthetic student dataset generator
│   │   │   ├── train.py         # Model training & metrics evaluation
│   │   │   └── model.py         # Runtime predictor service with explainability
│   │   └── schemas/
│   │       └── models.py        # Pydantic request/response validation
│   ├── data/
│   │   ├── sample_student_features.csv # 1,200 synthetic student records
│   │   ├── student_classifier.joblib   # Trained Random Forest artifact
│   │   ├── model_metrics.json          # Precision, Recall, F1, Confusion Matrix
│   │   └── learnmate.db                # SQLite database
│   ├── tests/
│   │   ├── test_ml.py           # ML prediction, threshold & explainability tests
│   │   ├── test_agents.py       # All 5 agents and orchestrator workflow tests
│   │   └── test_api.py          # FastAPI endpoint integration tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Navigation, SDG 4 badge & demo reset
│   │   │   ├── Dashboard.tsx        # KPIs, weekly activity & quiz charts
│   │   │   ├── LearnPractice.tsx    # Interactive quizzes & instant grading
│   │   │   ├── AiTutor.tsx          # Local curated knowledge chat & code
│   │   │   ├── StudyPlanner.tsx     # Adaptive schedule generator & checklist
│   │   │   ├── ProgressAnalytics.tsx# Timeline, before/after & ML Sandbox
│   │   │   ├── AgentActivity.tsx    # Multi-agent orchestrator workbench
│   │   │   └── AboutProject.tsx     # SDG 4 details & deliverable downloads
│   │   ├── api.ts                   # Typed API client
│   │   ├── types.ts                 # TypeScript interfaces
│   │   ├── App.tsx                  # Root component
│   │   └── index.css                # Tailwind styling
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── lean_canvas.pdf          # Polished 1-page Lean Canvas
│   ├── concept_note.pdf         # Formal academic Concept Note
│   ├── project_presentation.pptx# Editable 12-slide PowerPoint presentation
│   └── project_report.pdf       # Comprehensive Technical Final Report
├── generate_docs.py             # Script to regenerate all docs
├── README.md
└── .gitignore
```

---

## 4. Quickstart: Installation and Execution

### Prerequisites
- Python 3.10+ (Tested on Python 3.12.10)
- Node.js 18+ (Tested on Node.js v24.19.0 and npm 11.17.0)

### Step 1: Install Dependencies
Open two terminal windows in the project root:

**Terminal 1 (Backend):**
```powershell
pip install -r backend/requirements.txt
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm install
```

### Step 2: Launch the Backend Server
In Terminal 1 (from project root):
```powershell
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

### Step 3: Launch the Frontend Application
In Terminal 2 (inside `frontend/`):
```powershell
npm run dev
```
- Web Application URL: `http://localhost:5173`

---

## 5. Machine Learning Component

### Problem Formulation
Predicting a student's learning support category:
- **Class 0:** `Needs foundational revision`
- **Class 1:** `Developing understanding`
- **Class 2:** `Ready for advanced practice`

### Features Used
1. `previous_quiz_score` (0.0 to 100.0)
2. `recent_quiz_avg` (0.0 to 100.0)
3. `practice_completion_rate` (0.0 to 1.0)
4. `quiz_attempts_count` (integer >= 1)
5. `study_time_hours` (cumulative hours)
6. `performance_trend` (-1.0 to +1.0 trajectory)

### Model Performance Metrics (Evaluated on Unseen 20% Test Split)
- **Primary Model:** `RandomForestClassifier` (100 estimators, max depth 6)
  - **Accuracy:** **88.33%**
  - **Macro Precision:** **0.8821**
  - **Macro Recall:** **0.8810**
  - **Macro F1-Score:** **0.8809**
  - **Weighted F1-Score:** **0.8812**
- **Baseline Model:** `DecisionTreeClassifier` (depth 5)
  - **Accuracy:** **86.67%**

### Provenance Disclosure
The training data consists of 1,200 synthetic student trajectories (`backend/data/sample_student_features.csv`) calibrated with realistic domain noise to model student test pacing. The classification is strictly used for recommending educational resources and pacing, never as a judgment of general intelligence.

---

## 6. Multi-Agent Agentic Architecture

The application coordinates five specialized agents orchestrated by a Master Orchestrator:

1. **Master Agent Orchestrator:** Analyzes user natural language intent, creates an ordered task dependency plan, routes subtasks to specialized agents, pipes intermediate outputs, handles fallbacks, and persists an audit log to SQLite.
2. **Tutor Agent:** Retrieves verified academic explanations and Python code snippets using local TF-IDF matching across an offline knowledge base.
3. **Quiz Agent:** Generates topic-specific multiple-choice assessments, scores answers, and delivers immediate pedagogical explanations.
4. **Learning Analyst Agent:** Evaluates quiz score trajectories, calculates subject mastery, and queries the Scikit-Learn classification model.
5. **Study Planner Agent:** Synthesizes identified student gaps and available daily study time into a realistic, 5-day milestone checklist.
6. **Career Guide Agent:** Maps student competencies to industry job roles (AI/ML Engineer, Data Scientist, Full-Stack AI) and recommends portfolio capstone projects.

---

## 7. Automated Testing Results

Automated unit and integration test suites were executed using `pytest`:

```powershell
$env:PYTHONPATH="backend"
python -m pytest backend/tests -v
```

**Results:**
```
======================== 18 passed in 3.34s ========================
backend/tests/test_agents.py::test_tutor_agent_retrieval PASSED
backend/tests/test_agents.py::test_tutor_agent_fallback PASSED
backend/tests/test_agents.py::test_quiz_agent_question_generation PASSED
backend/tests/test_agents.py::test_analyst_agent PASSED
backend/tests/test_agents.py::test_planner_agent PASSED
backend/tests/test_agents.py::test_career_agent PASSED
backend/tests/test_agents.py::test_orchestrator_composite_workflow PASSED
backend/tests/test_api.py::test_health_check PASSED
backend/tests/test_api.py::test_dashboard_summary PASSED
backend/tests/test_api.py::test_quiz_topics_and_submit PASSED
backend/tests/test_api.py::test_ml_prediction_endpoint PASSED
backend/tests/test_api.py::test_ml_model_info PASSED
backend/tests/test_api.py::test_tutor_query PASSED
backend/tests/test_api.py::test_planner_endpoints PASSED
backend/tests/test_api.py::test_agent_orchestrator_execution PASSED
backend/tests/test_ml.py::test_model_loaded_and_predicts PASSED
backend/tests/test_ml.py::test_foundational_revision_prediction PASSED
backend/tests/test_ml.py::test_model_metrics_structure PASSED
```

**Frontend Build Verification:**
```powershell
cd frontend
npm run build
```
✓ Transformed 2,503 modules. Zero TypeScript or Vite bundling errors.

---

## 8. Mandatory Submission Deliverables

The four required project deliverables are saved in the `docs/` folder:

1. **Lean Canvas:** `docs/lean_canvas.pdf` (High-resolution, single-page landscape 9-box business & impact model).
2. **Concept Note:** `docs/concept_note.pdf` (Formal academic concept note with methodology, architecture, and SDG 4 alignment).
3. **PowerPoint Presentation:** `docs/project_presentation.pptx` (12-slide editable presentation deck).
4. **Technical Project Report:** `docs/project_report.pdf` (Comprehensive technical final report with architecture and test logs).

*All four files can also be downloaded directly within the application on the **About Project** tab.*

---

## 9. 3-Minute Live Evaluation Demonstration Script

Use this script during evaluation:

- **Minute 1: The Problem & Dashboard Walkthrough**
  - Open `http://localhost:5173`.
  - State: *"LearnMate AI is a personal AI learning companion built for the BharatCares Machine Learning & Applied AI Internship to support UN SDG 4."*
  - Point to the **Dashboard KPIs**: Average Quiz Score (76.0%), 9-day streak, verified SQLite attempt counts, and the **Scikit-Learn ML Support Tier badge** (`Developing understanding`, 85% confidence).
  - Highlight the **Adaptive Recommendations** generated from actual quiz weaknesses.

- **Minute 2: Interactive Assessment & Machine Learning Diagnostics**
  - Click on **Learn & Practice** and take a quiz (e.g., *Machine Learning Fundamentals*).
  - Submit answers and show the instant scoring card and detailed pedagogical explanations.
  - Navigate to **My Progress**: Show the **Before-and-After Growth Gain** (+20 points) and the **Interactive ML Sandbox**.
  - Move the slider for *Recent Quiz Average* to 95% and click *Run Real-time ML Prediction* to demonstrate the Random Forest model predicting `Ready for advanced practice` with live probability distribution.

- **Minute 3: Multi-Agent Orchestration & Deliverables**
  - Navigate to **Agent Activity**: Show the 5 specialized agents.
  - Click the preset workflow: *"Composite Diagnostic & Study Blueprint"*.
  - Walk the evaluator through the live execution stepper: Analyst diagnoses gaps, Tutor retrieves curated knowledge cards, Planner synthesizes a 5-day schedule, all with recorded latency and fallback monitors.
  - Conclude in **About Project**: Highlight the UN SDG 4 social impact and show the 4 generated deliverables ready for download (`lean_canvas.pdf`, `concept_note.pdf`, `project_presentation.pptx`, `project_report.pdf`).

---

## 10. License & Academic Integrity Notice

This project was built for the **BharatCares Machine Learning & Applied AI Internship (August – September 2026)**. All training data provenance, local knowledge base curation, and agent capabilities are transparently reported without synthetic claims or unverified external dependencies.
