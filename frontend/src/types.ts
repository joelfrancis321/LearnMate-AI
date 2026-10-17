export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  current_semester: string;
  target_goal: string;
  daily_study_hours: number;
  streak_days: number;
}

export interface DashboardSummary {
  student: StudentProfile;
  kpis: {
    total_learning_sessions: number;
    average_quiz_score: number;
    learning_streak_days: number;
    topics_mastered_count: number;
    topics_needing_improvement_count: number;
    practice_completion_rate: number;
    ml_support_tier: string;
    ml_confidence: number;
  };
  strengths: string[];
  weaknesses: string[];
  subject_mastery: {
    topic: string;
    average_score: number;
    attempts: number;
    status: string;
  }[];
  weekly_activity: {
    day: string;
    study_hours: number;
    quizzes_taken: number;
    tasks_done: number;
  }[];
  quiz_trend: {
    index: number;
    topic: string;
    score: number;
    date: string;
  }[];
  recommendations: Recommendation[];
  ml_full_prediction?: MLPredictionResult;
}

export interface Recommendation {
  id: string;
  title: string;
  topic: string;
  action_type: string;
  estimated_minutes: number;
  priority: string;
  reason: string;
  badge: string;
  target_url: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  total_questions: number;
}

export interface QuizQuestion {
  id: number;
  topic_id: string;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_option: string;
  explanation: string;
}

export interface QuizEvaluationResult {
  agent: string;
  status: string;
  attempt_id: number;
  topic_id: string;
  topic_title: string;
  score: number;
  correct_count: number;
  total_questions: number;
  summary: string;
  detailed_review: {
    question_id: number;
    question_text: string;
    selected_option: string;
    correct_option: string;
    is_correct: boolean;
    explanation: string;
  }[];
}

export interface MLPredictionResult {
  predicted_category: string;
  category_code: number;
  confidence: number;
  probabilities: Record<string, number>;
  input_features: {
    previous_quiz_score: number;
    recent_quiz_avg: number;
    practice_completion_rate: number;
    quiz_attempts_count: number;
    study_time_hours: number;
    performance_trend: number;
  };
  pedagogical_explanation: string;
  recommended_focus: string;
  ethical_notice: string;
}

export interface ModelMetadata {
  model_name: string;
  baseline_model: string;
  train_samples: number;
  test_samples: number;
  primary_model_metrics: {
    accuracy: number;
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
    f1_weighted: number;
  };
  baseline_metrics: {
    decision_tree_accuracy: number;
  };
  confusion_matrix: number[][];
  feature_importances: { feature: string; importance: number }[];
  provenance_disclosure: string;
}

export interface TutorResponse {
  agent: string;
  status: string;
  topic: string;
  title: string;
  explanation: string;
  code_snippet: string | null;
  key_takeaway: string | null;
  matched: boolean;
  source: string;
  confidence: number;
}

export interface StudyTask {
  id: number;
  plan_id: number;
  day_number: number;
  title: string;
  topic: string;
  estimated_minutes: number;
  is_completed: number;
  completed_at: string | null;
}

export interface StudyPlanData {
  has_plan: boolean;
  plan: {
    id: number;
    student_id: string;
    subject: string;
    target_goal: string;
    deadline_date: string;
    daily_hours: number;
    status: string;
    created_at: string;
  } | null;
  total_tasks: number;
  completed_tasks: number;
  completion_rate_percent: number;
  tasks: StudyTask[];
}

export interface AgentExecutionStep {
  step: number;
  agent_name: string;
  role_description: string;
  status: string;
  latency_ms: number;
  summary: string;
  details: any;
}

export interface AgentWorkflowResult {
  orchestrator_summary: string;
  workflow_type: string;
  agents_involved: string[];
  task_plan: string[];
  execution_status: string;
  fallback_used: boolean;
  total_latency_ms: number;
  steps: AgentExecutionStep[];
  final_context: any;
}

export interface AgentLogItem {
  id: number;
  request_text: string;
  workflow_type: string;
  agents_involved: string[];
  task_plan: string[];
  execution_status: string;
  fallback_used: boolean;
  latency_ms: number;
  created_at: string;
  result_details: any;
}
