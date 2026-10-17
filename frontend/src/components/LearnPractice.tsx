import React, { useState, useEffect } from 'react';
import { QuizTopic, QuizQuestion, QuizEvaluationResult } from '../types';
import {
  fetchQuizTopics,
  fetchQuizQuestions,
  submitQuizAnswers
} from '../api';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';

interface LearnPracticeProps {
  onQuizCompleted: () => void;
  onNavigate: (tab: string) => void;
}

export const LearnPractice: React.FC<LearnPracticeProps> = ({ onQuizCompleted, onNavigate }) => {
  const [topics, setTopics] = useState<QuizTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<QuizEvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (selectedTopic && !evalResult) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedTopic, evalResult]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const res = await fetchQuizTopics();
      setTopics(res.topics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (topic: QuizTopic) => {
    try {
      setLoading(true);
      setSelectedTopic(topic);
      setEvalResult(null);
      setUserAnswers({});
      setCurrentIndex(0);
      setTimerSeconds(0);
      const res = await fetchQuizQuestions(topic.id);
      setQuestions(res.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (questionId: number, optionLetter: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionLetter,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedTopic) return;
    try {
      setIsSubmitting(true);
      const res = await submitQuizAnswers('STU_DEMO_01', selectedTopic.id, userAnswers, timerSeconds);
      setEvalResult(res);
      onQuizCompleted();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !selectedTopic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading assessment topics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
              Personalized Assessment Engine
            </span>
            <span className="text-slate-400 text-xs">• Instant Grading & Explanations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Learn & Practice Quizzes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your knowledge across Python programming, machine learning, and core data structures.
          </p>
        </div>

        {selectedTopic && (
          <button
            onClick={() => {
              setSelectedTopic(null);
              setEvalResult(null);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm flex items-center gap-1.5 self-start cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to All Topics
          </button>
        )}
      </div>

      {/* View 1: Topics Selection Grid */}
      {!selectedTopic && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {t.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> {t.total_questions} Questions
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-snug">{t.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{t.category}</span>
                <button
                  onClick={() => startQuiz(t)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  Take Quiz <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Active Quiz Taking Mode */}
      {selectedTopic && !evalResult && questions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Progress & Timer Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{selectedTopic.title}</span>
              <span className="text-slate-400">•</span>
              <span className="text-indigo-600 font-bold">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Current Question Card */}
          {(() => {
            const currentQ = questions[currentIndex];
            const selectedOpt = userAnswers[String(currentQ.id)];
            return (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Question #{currentIndex + 1}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                    {currentQ.question_text}
                  </h2>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {(Object.keys(currentQ.options) as Array<'A' | 'B' | 'C' | 'D'>).map((optKey) => {
                    const isSelected = selectedOpt === optKey;
                    return (
                      <div
                        key={optKey}
                        onClick={() => selectOption(currentQ.id, optKey)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-600/20 text-slate-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {optKey}
                        </div>
                        <span className="text-sm font-medium leading-relaxed">{currentQ.options[optKey]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Navigation Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="flex items-center gap-1.5">
                    {questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          currentIndex === idx
                            ? 'bg-indigo-600 w-5'
                            : userAnswers[String(q.id)]
                            ? 'bg-teal-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          Submit Answers <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* View 3: Post-Quiz Detailed Results & Explanations */}
      {selectedTopic && evalResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Score Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/80">
                  Assessment Completed
                </span>
                <h2 className="text-2xl font-black">{evalResult.topic_title}</h2>
                <p className="text-xs text-slate-300 max-w-md">{evalResult.summary}</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15 min-w-[140px]">
                <div className="text-3xl sm:text-4xl font-black text-teal-300">{evalResult.score}%</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {evalResult.correct_count} of {evalResult.total_questions} Correct
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Performance recorded to SQLite attempt history (ID: #{evalResult.attempt_id}).
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startQuiz(selectedTopic)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Return to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Answer Review & Explanations</h3>
            {evalResult.detailed_review.map((item, idx) => (
              <div
                key={item.question_id}
                className={`p-5 rounded-xl border bg-white shadow-sm space-y-3 ${
                  item.is_correct ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{item.question_text}</span>
                  </div>
                  {item.is_correct ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Your Answer</span>
                    <span className="font-bold text-slate-800">
                      Option {item.selected_option || 'None selected'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200">
                    <span className="text-emerald-700 font-semibold block text-[10px] uppercase">Correct Answer</span>
                    <span className="font-bold text-emerald-900">Option {item.correct_option}</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-indigo-900 flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" /> Pedagogical Explanation:
                  </div>
                  <p className="leading-relaxed text-slate-600">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
