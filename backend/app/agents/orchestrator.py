"""
LearnMate AI - Multi-Agent Orchestrator
Author: LearnMate AI Engineering Team (BharatCares Internship)

Coordinates 5 specialized local agents:
  1. Tutor Agent
  2. Quiz Agent
  3. Learning Analyst Agent
  4. Study Planner Agent
  5. Career Guide Agent

Workflow:
  - Natural Language Intent Identification
  - Task Decomposition & Ordered Plan Creation
  - Inter-Agent Data Piping
  - Error Handling & Transparent Fallback
  - Structured Execution Log Generation & SQLite Persistence
"""

import time
import json
from typing import Dict, Any, List
from app.agents.tutor_agent import tutor_agent
from app.agents.quiz_agent import quiz_agent
from app.agents.analyst_agent import analyst_agent
from app.agents.planner_agent import planner_agent
from app.agents.career_agent import career_agent
from app.db import get_connection

class AgentOrchestrator:
    def __init__(self):
        self.registered_agents = {
            "tutor": tutor_agent,
            "quiz": quiz_agent,
            "analyst": analyst_agent,
            "planner": planner_agent,
            "career": career_agent
        }

    def determine_plan(self, request_text: str) -> Dict[str, Any]:
        """
        Decomposes user prompt into a task plan and maps to corresponding agent(s).
        """
        text = request_text.lower()
        
        # Composite Workflow 1: Diagnostic Assessment & Study Blueprint
        if any(w in text for w in ["diagnose", "blueprint", "full diagnostic"]) or ("analyze" in text and "plan" in text) or ("review" in text and "plan" in text):
            return {
                "workflow_type": "Composite Diagnostic & Study Blueprint",
                "agents": ["analyst", "tutor", "planner"],
                "tasks": [
                    {"step": 1, "agent": "analyst", "description": "Extract quiz history, compute subject mastery, and predict ML support category."},
                    {"step": 2, "agent": "tutor", "description": "Retrieve foundational concepts and code examples for diagnosed weak topics."},
                    {"step": 3, "agent": "planner", "description": "Synthesize weak topics into an adaptive 5-day study plan."}
                ]
            }
            
        # Composite Workflow 2: Learning & Quiz Drill
        if any(w in text for w in ["explain and test", "teach me and quiz", "quiz on", "test me on", "practice test"]):
            return {
                "workflow_type": "Pedagogical Concept & Practice Assessment",
                "agents": ["tutor", "quiz"],
                "tasks": [
                    {"step": 1, "agent": "tutor", "description": "Retrieve comprehensive concept explanation and code pattern from local knowledge base."},
                    {"step": 2, "agent": "quiz", "description": "Generate diagnostic quiz questions corresponding to the explained subject."}
                ]
            }
            
        # Composite Workflow 3: Career Roadmapping
        if any(w in text for w in ["career", "job", "internship", "industry", "roadmap", "portfolio", "resume"]):
            return {
                "workflow_type": "Competency Analysis & Career Roadmapping",
                "agents": ["analyst", "career"],
                "tasks": [
                    {"step": 1, "agent": "analyst", "description": "Assess verified strengths and practice rate from student profile."},
                    {"step": 2, "agent": "career", "description": "Map student profile to industry career pathway, required tech stack, and portfolio projects."}
                ]
            }
            
        # Single Agent: Study Plan
        if any(w in text for w in ["plan", "schedule", "routine", "deadline", "timetable"]):
            return {
                "workflow_type": "Adaptive Study Plan Generation",
                "agents": ["planner"],
                "tasks": [
                    {"step": 1, "agent": "planner", "description": "Construct structured milestone-driven study timetable."}
                ]
            }
            
        # Single Agent: Quiz
        if any(w in text for w in ["quiz", "questions", "assessment", "mcq"]):
            return {
                "workflow_type": "Interactive Quiz Generation",
                "agents": ["quiz"],
                "tasks": [
                    {"step": 1, "agent": "quiz", "description": "Fetch curated quiz questions from assessment bank."}
                ]
            }
            
        # Single Agent: Learning Analysis
        if any(w in text for w in ["progress", "analysis", "scores", "how am i doing", "analytics", "trend"]):
            return {
                "workflow_type": "Student Performance Analytics",
                "agents": ["analyst"],
                "tasks": [
                    {"step": 1, "agent": "analyst", "description": "Run statistical analysis and ML support tier inference."}
                ]
            }
            
        # Default: Tutor Agent
        return {
            "workflow_type": "Academic Concept Tutoring",
            "agents": ["tutor"],
            "tasks": [
                {"step": 1, "agent": "tutor", "description": "Retrieve verified educational concept explanation from curated offline repository."}
            ]
        }

    def execute_workflow(self, request_text: str, student_id: str = "STU_DEMO_01", params: Dict[str, Any] = None) -> Dict[str, Any]:
        start_time = time.time()
        plan_meta = self.determine_plan(request_text)
        
        execution_steps = []
        shared_context = {"student_id": student_id, "request": request_text}
        if params:
            shared_context.update(params)
            
        fallback_used = False
        workflow_success = True
        
        try:
            for task in plan_meta["tasks"]:
                step_num = task["step"]
                agent_key = task["agent"]
                description = task["description"]
                step_start = time.time()
                
                agent_output = {}
                # Agent Dispatch
                if agent_key == "analyst":
                    agent_output = analyst_agent.analyze_student(student_id)
                    # Pipe findings to shared context
                    shared_context["weaknesses"] = agent_output.get("weaknesses", [])
                    shared_context["strengths"] = agent_output.get("strengths", [])
                    shared_context["ml_tier"] = agent_output.get("ml_support_tier", "Developing understanding")
                    
                elif agent_key == "tutor":
                    # Determine query from shared context or raw request
                    query = request_text
                    if "weaknesses" in shared_context and shared_context["weaknesses"]:
                        query = f"{shared_context['weaknesses'][0]} {request_text}"
                    agent_output = tutor_agent.execute(query, shared_context)
                    shared_context["tutor_explanation"] = agent_output.get("explanation")
                    if not agent_output.get("matched", False):
                        fallback_used = True
                        
                elif agent_key == "quiz":
                    topic_id = params.get("topic_id", "ml_fundamentals") if params else "ml_fundamentals"
                    agent_output = quiz_agent.get_questions_for_topic(topic_id, limit=5)
                    shared_context["quiz_questions"] = agent_output.get("questions")
                    
                elif agent_key == "planner":
                    subj = params.get("subject", "AI & Computer Science") if params else "AI & Computer Science"
                    goal = params.get("target_goal", "Semester Exam & Interview Prep") if params else "Semester Exam & Interview Prep"
                    hours = float(params.get("daily_hours", 2.5)) if params else 2.5
                    weaknesses = shared_context.get("weaknesses", ["Data Structures & Algorithms"])
                    agent_output = planner_agent.generate_plan(
                        student_id=student_id,
                        subject=subj,
                        target_goal=goal,
                        daily_hours=hours,
                        weaknesses=weaknesses
                    )
                    shared_context["generated_plan_id"] = agent_output.get("plan_id")
                    
                elif agent_key == "career":
                    goal = params.get("career_goal", "ai_ml_engineer") if params else "ai_ml_engineer"
                    strengths = shared_context.get("strengths", ["Python Programming Fundamentals"])
                    agent_output = career_agent.recommend(career_goal=goal, current_strengths=strengths)
                    
                step_latency = int((time.time() - step_start) * 1000)
                
                execution_steps.append({
                    "step": step_num,
                    "agent_name": agent_output.get("agent", agent_key.capitalize()),
                    "role_description": description,
                    "status": agent_output.get("status", "Success"),
                    "latency_ms": step_latency,
                    "summary": agent_output.get("summary") or agent_output.get("title") or f"{agent_key} executed successfully",
                    "details": agent_output
                })

        except Exception as e:
            workflow_success = False
            fallback_used = True
            execution_steps.append({
                "step": len(execution_steps) + 1,
                "agent_name": "System Orchestrator Fallback",
                "role_description": "Graceful error recovery",
                "status": "Fallback Invoked",
                "latency_ms": 10,
                "summary": f"Orchestrator recovered safely from exception: {str(e)}",
                "details": {"error": str(e)}
            })

        total_latency_ms = int((time.time() - start_time) * 1000)
        overall_status = "Success" if workflow_success else "Partial Success (Fallback)"
        
        result_payload = {
            "orchestrator_summary": f"Completed {plan_meta['workflow_type']} with {len(execution_steps)} agent steps.",
            "workflow_type": plan_meta["workflow_type"],
            "agents_involved": [self.registered_agents[a].name for a in plan_meta["agents"] if a in self.registered_agents],
            "task_plan": [t["description"] for t in plan_meta["tasks"]],
            "execution_status": overall_status,
            "fallback_used": fallback_used,
            "total_latency_ms": total_latency_ms,
            "steps": execution_steps,
            "final_context": {
                "student_id": student_id,
                "ml_tier": shared_context.get("ml_tier"),
                "weaknesses": shared_context.get("weaknesses"),
                "strengths": shared_context.get("strengths")
            }
        }
        
        # Persist execution log to database
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO agent_logs (request_text, workflow_type, agents_involved_json, task_plan_json, execution_status, result_json, fallback_used, latency_ms)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                request_text,
                plan_meta["workflow_type"],
                json.dumps(result_payload["agents_involved"]),
                json.dumps(result_payload["task_plan"]),
                overall_status,
                json.dumps(result_payload),
                1 if fallback_used else 0,
                total_latency_ms
            ))
            conn.commit()
            conn.close()
        except Exception as log_err:
            print(f"[Warning] Failed to persist agent log: {log_err}")
            
        return result_payload

orchestrator = AgentOrchestrator()
