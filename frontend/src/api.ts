import {
  DashboardSummary,
  QuizTopic,
  QuizQuestion,
  QuizEvaluationResult,
  MLPredictionResult,
  ModelMetadata,
  TutorResponse,
  StudyPlanData,
  AgentWorkflowResult,
  AgentLogItem
} from './types';

const API_BASE = '/api';

export async function fetchDashboardSummary(studentId: string = 'STU_DEMO_01'): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/dashboard/summary/${studentId}`);
  if (!res.ok) throw new Error('Failed to load dashboard summary');
  return res.json();
}

export async function resetDemoData(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/dashboard/reset-demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}

export async function fetchQuizTopics(): Promise<{ topics: QuizTopic[] }> {
  const res = await fetch(`${API_BASE}/quiz/topics`);
  if (!res.ok) throw new Error('Failed to load quiz topics');
  return res.json();
}

export async function fetchQuizQuestions(topicId: string): Promise<{ questions: QuizQuestion[]; count: number }> {
  const res = await fetch(`${API_BASE}/quiz/topic/${topicId}`);
  if (!res.ok) throw new Error('Failed to load quiz questions');
  return res.json();
}

export async function submitQuizAnswers(
  studentId: string,
  topicId: string,
  answers: Record<string, string>,
  timeSpentSec: number
): Promise<QuizEvaluationResult> {
  const res = await fetch(`${API_BASE}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_id: studentId,
      topic_id: topicId,
      user_answers: answers,
      time_spent_seconds: timeSpentSec,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit quiz answers');
  return res.json();
}

export async function predictMLSupport(features: {
  previous_quiz_score: number;
  recent_quiz_avg: number;
  practice_completion_rate: number;
  quiz_attempts_count: number;
  study_time_hours: number;
  performance_trend: number;
}): Promise<MLPredictionResult> {
  const res = await fetch(`${API_BASE}/ml/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(features),
  });
  if (!res.ok) throw new Error('Failed to run ML prediction');
  return res.json();
}

export async function fetchModelInfo(): Promise<ModelMetadata> {
  const res = await fetch(`${API_BASE}/ml/model-info`);
  if (!res.ok) throw new Error('Failed to load model metadata');
  return res.json();
}

export async function fetchStudentFeatures(studentId: string = 'STU_DEMO_01'): Promise<any> {
  const res = await fetch(`${API_BASE}/ml/student-features/${studentId}`);
  if (!res.ok) throw new Error('Failed to load student features');
  return res.json();
}

export async function askTutor(query: string): Promise<TutorResponse> {
  const res = await fetch(`${API_BASE}/tutor/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Failed to query AI tutor');
  return res.json();
}

export async function fetchSuggestedPrompts(): Promise<{ prompts: string[] }> {
  const res = await fetch(`${API_BASE}/tutor/suggested-prompts`);
  if (!res.ok) throw new Error('Failed to load suggested prompts');
  return res.json();
}

export async function fetchActivePlan(studentId: string = 'STU_DEMO_01'): Promise<StudyPlanData> {
  const res = await fetch(`${API_BASE}/planner/active/${studentId}`);
  if (!res.ok) throw new Error('Failed to load study plan');
  return res.json();
}

export async function createStudyPlan(payload: {
  student_id: string;
  subject: string;
  target_goal: string;
  deadline_days: number;
  daily_hours: number;
  weaknesses?: string[];
}): Promise<any> {
  const res = await fetch(`${API_BASE}/planner/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate study plan');
  return res.json();
}

export async function toggleTaskCompletion(taskId: number, isCompleted: boolean): Promise<any> {
  const res = await fetch(`${API_BASE}/planner/toggle-task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId, is_completed: isCompleted }),
  });
  if (!res.ok) throw new Error('Failed to toggle task');
  return res.json();
}

export async function fetchProgressAnalytics(studentId: string = 'STU_DEMO_01'): Promise<any> {
  const res = await fetch(`${API_BASE}/progress/analytics/${studentId}`);
  if (!res.ok) throw new Error('Failed to load progress analytics');
  return res.json();
}

export async function executeAgentWorkflow(
  requestText: string,
  studentId: string = 'STU_DEMO_01',
  params?: any
): Promise<AgentWorkflowResult> {
  const res = await fetch(`${API_BASE}/agents/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      request_text: requestText,
      student_id: studentId,
      params,
    }),
  });
  if (!res.ok) throw new Error('Failed to execute agent workflow');
  return res.json();
}

export async function fetchAgentLogs(): Promise<{ logs: AgentLogItem[] }> {
  const res = await fetch(`${API_BASE}/agents/logs`);
  if (!res.ok) throw new Error('Failed to fetch agent logs');
  return res.json();
}

export async function fetchAgentCatalog(): Promise<any> {
  const res = await fetch(`${API_BASE}/agents/catalog`);
  if (!res.ok) throw new Error('Failed to load agent catalog');
  return res.json();
}
