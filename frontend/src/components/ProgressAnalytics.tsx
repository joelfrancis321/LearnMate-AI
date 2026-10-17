import React, { useState, useEffect } from 'react';
import {
  fetchProgressAnalytics,
  fetchModelInfo,
  predictMLSupport,
  fetchStudentFeatures
} from '../api';
import {
  ModelMetadata,
  MLPredictionResult
} from '../types';
import {
  TrendingUp,
  Award,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const ProgressAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<ModelMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  // ML Sandbox interactive test state
  const [sandboxFeatures, setSandboxFeatures] = useState({
    previous_quiz_score: 75.0,
    recent_quiz_avg: 80.0,
    practice_completion_rate: 0.65,
    quiz_attempts_count: 5,
    study_time_hours: 17.5,
    performance_trend: 0.20,
  });
  const [sandboxResult, setSandboxResult] = useState<MLPredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [progRes, modelRes, featRes] = await Promise.all([
        fetchProgressAnalytics('STU_DEMO_01'),
        fetchModelInfo(),
        fetchStudentFeatures('STU_DEMO_01'),
      ]);
      setAnalytics(progRes);
      setModelInfo(modelRes);
      if (featRes) {
        setSandboxFeatures(featRes);
        // Run initial prediction
        const pred = await predictMLSupport(featRes);
        setSandboxResult(pred);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPrediction = async () => {
    try {
      setIsPredicting(true);
      const res = await predictMLSupport(sandboxFeatures);
      setSandboxResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredicting(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Computing analytics and loading ML models...</p>
      </div>
    );
  }

  const { timeline, before_after, subject_distribution } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
            Empirical Progress & ML Diagnostics
          </span>
          <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
            Student: Joel Francis (B.Tech CSE)
          </span>
          <span className="text-slate-400 text-xs">• Verified Historical Observations</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1">My Learning Progress Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review score progression, subject benchmarks, before-and-after gains, and machine learning explainability.
        </p>
      </div>

      {/* Before and After Growth Comparison Card */}
      {before_after && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Performance Trajectory
              </span>
              <h2 className="text-lg font-bold text-white mt-1">Before vs. After Comparative Gain</h2>
              <p className="text-xs text-slate-300">
                Evaluation of initial diagnostic baseline versus recent assessment scores.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-white/10 px-5 py-3 rounded-xl border border-white/10">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Initial Baseline</span>
                <span className="text-xl font-bold text-slate-200">{before_after.initial_avg_score}%</span>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-300" />
              <div className="text-center">
                <span className="text-[10px] text-teal-300 uppercase font-bold block">Current Average</span>
                <span className="text-xl font-black text-teal-300">{before_after.current_avg_score}%</span>
              </div>
              <div className="border-l border-white/20 pl-4 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Net Growth</span>
                <span className="text-xl font-black text-emerald-400">+{before_after.delta_points}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts: Timeline & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Assessment Score Timeline</h3>
              <p className="text-xs text-slate-500">Chronological score trajectory across all quizzes</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="attempt" stroke="#64748b" fontSize={12} tickLine={false} label={{ value: 'Attempt #', position: 'insideBottomRight', offset: -5, fontSize: 10 }} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Comparison vs Benchmark */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Subject Mastery vs Benchmark</h3>
              <p className="text-xs text-slate-500">Student score vs 70% proficiency threshold</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subject_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="mastery" fill="#0d9488" name="Student Mastery" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" fill="#cbd5e1" name="Benchmark" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION: Machine Learning Model Transparency & Evaluation */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Genuine Scikit-Learn Classification Model
              </span>
              <span className="text-slate-400 text-xs">• Supervised Random Forest</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Model Architecture & Empirical Metrics</h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Train/Test Split:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">80% / 20%</span>
          </div>
        </div>

        {/* Model Metrics Table Cards */}
        {modelInfo && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Accuracy</span>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">
                {(modelInfo.primary_model_metrics.accuracy * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">Baseline (DT): {(modelInfo.baseline_metrics.decision_tree_accuracy * 100).toFixed(1)}%</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Precision (Macro)</span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                {(modelInfo.primary_model_metrics.precision_macro * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">Minimizes false classification</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Recall (Macro)</span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                {(modelInfo.primary_model_metrics.recall_macro * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">Detects struggling students</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">F1-Score</span>
              <div className="text-2xl font-black text-teal-600 mt-0.5">
                {modelInfo.primary_model_metrics.f1_macro.toFixed(4)}
              </div>
              <span className="text-[10px] text-slate-400">Harmonic mean balance</span>
            </div>
          </div>
        )}

        {/* Feature Importances Bar Chart */}
        {modelInfo?.feature_importances && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Feature Importance Distribution (Random Forest Gini Gain)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {modelInfo.feature_importances.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 font-mono text-[11px]">{item.feature}</span>
                    <span className="font-bold text-indigo-600">{(item.importance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${item.importance * 100 * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Provenance Disclosure */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" /> Transparent Data Provenance Disclosure:
          </div>
          <p className="leading-relaxed text-amber-800">
            {modelInfo?.provenance_disclosure ||
              "The model is trained on a synthetic dataset of 1,200 student trajectories specifically calibrated to model realistic test distributions, completion pacing, and score trends. It is not represented as validated clinical student psychology."}
          </p>
        </div>
      </div>

      {/* SECTION: Interactive ML Prediction Sandbox */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" /> Interactive ML Inference Sandbox
            </h3>
            <p className="text-xs text-slate-500">
              Adjust student feature sliders and invoke <code>POST /api/ml/predict</code> in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sliders on Left */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Recent Quiz Average</span>
                <span className="font-mono text-indigo-600 font-bold">{sandboxFeatures.recent_quiz_avg}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={sandboxFeatures.recent_quiz_avg}
                onChange={(e) =>
                  setSandboxFeatures((prev) => ({ ...prev, recent_quiz_avg: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Previous Quiz Score</span>
                <span className="font-mono text-indigo-600 font-bold">{sandboxFeatures.previous_quiz_score}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={sandboxFeatures.previous_quiz_score}
                onChange={(e) =>
                  setSandboxFeatures((prev) => ({ ...prev, previous_quiz_score: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Practice Completion Rate</span>
                <span className="font-mono text-indigo-600 font-bold">
                  {Math.round(sandboxFeatures.practice_completion_rate * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sandboxFeatures.practice_completion_rate}
                onChange={(e) =>
                  setSandboxFeatures((prev) => ({ ...prev, practice_completion_rate: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Quiz Attempts</span>
                  <span className="font-mono text-indigo-600 font-bold">{sandboxFeatures.quiz_attempts_count}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={sandboxFeatures.quiz_attempts_count}
                  onChange={(e) =>
                    setSandboxFeatures((prev) => ({ ...prev, quiz_attempts_count: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Study Hours</span>
                  <span className="font-mono text-indigo-600 font-bold">{sandboxFeatures.study_time_hours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={sandboxFeatures.study_time_hours}
                  onChange={(e) =>
                    setSandboxFeatures((prev) => ({ ...prev, study_time_hours: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleRunPrediction}
              disabled={isPredicting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isPredicting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running Inference...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4 text-teal-300" /> Run Real-time ML Prediction
                </>
              )}
            </button>
          </div>

          {/* Inference Output Card on Right */}
          {sandboxResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  Model Prediction
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Confidence: {Math.round(sandboxResult.confidence * 100)}%
                </span>
              </div>

              <div>
                <h4 className="text-xs text-slate-400 uppercase font-semibold">Predicted Support Tier:</h4>
                <div className="text-2xl font-black text-teal-300 mt-0.5">
                  {sandboxResult.predicted_category}
                </div>
              </div>

              {/* Class Probability Distribution */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">
                  Probability Distribution:
                </span>
                {Object.entries(sandboxResult.probabilities).map(([cat, prob]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 text-[11px]">{cat}</span>
                      <span className="font-mono font-bold text-teal-300">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${prob * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-300 space-y-1.5">
                <strong className="text-white block font-semibold">Pedagogical Explanation:</strong>
                <p className="leading-relaxed text-slate-300 text-[11px]">
                  {sandboxResult.pedagogical_explanation}
                </p>
                <div className="p-2 bg-indigo-950/60 rounded-lg border border-indigo-800/80 text-[11px] text-teal-200">
                  <strong>Recommended Focus: </strong> {sandboxResult.recommended_focus}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
