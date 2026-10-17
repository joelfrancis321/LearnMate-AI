"""
LearnMate AI - Backend API Application
Organization: BharatCares
Program: Machine Learning & Applied AI Internship
SDG Alignment: UN SDG 4 - Quality Education
Tagline: Your Personal AI Learning and Student Success Companion
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.db import init_db, seed_database
from app.routes.dashboard import router as dashboard_router
from app.routes.quiz import router as quiz_router
from app.routes.ml import router as ml_router
from app.routes.tutor import router as tutor_router
from app.routes.planner import router as planner_router
from app.routes.progress import router as progress_router
from app.routes.agents import router as agents_router

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_database(force=False)
    print("LearnMate AI backend initialized successfully. SQLite database verified.")
    yield

app = FastAPI(
    title="LearnMate AI API",
    description="Intelligent Learning and Student Success Companion for BharatCares ML & Applied AI Internship.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard_router)
app.include_router(quiz_router)
app.include_router(ml_router)
app.include_router(tutor_router)
app.include_router(planner_router)
app.include_router(progress_router)
app.include_router(agents_router)

@app.get("/api/info")
def root_info():
    return {
        "project": "LearnMate AI",
        "tagline": "Your Personal AI Learning and Student Success Companion",
        "organization": "BharatCares",
        "program": "Machine Learning & Applied AI Internship",
        "sdg_alignment": "UN SDG 4 - Quality Education",
        "status": "Operational",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

@app.get("/api/docs/download/{filename}")
def download_deliverable(filename: str):
    docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "docs"))
    file_path = os.path.join(docs_dir, filename)
    if os.path.exists(file_path):
        media_type = "application/pdf" if filename.endswith(".pdf") else "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        return FileResponse(file_path, media_type=media_type, filename=filename)
    return JSONResponse(status_code=404, content={"detail": f"File {filename} not found in docs directory"})

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "learnmate-ai-backend",
        "storage": "sqlite3",
        "ml_engine": "scikit-learn (RandomForestClassifier)",
        "agentic_orchestrator": "active"
    }

# Mount static frontend build
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

