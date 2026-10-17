import React from 'react';
import {
  DashboardSummary,
  Recommendation
} from '../types';
import {
  Flame,
  Award,
  BookOpen,
  Target,
  BrainCircuit,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

interface DashboardProps {
  data: DashboardSummary | null;
  loading: boolean;
  onNavigate: (tab: string, context?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, loading, onNavigate }) => {
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-medium text-sm">Loading your personalized learning dashboard...</p>
      </div>
    );
  }

  const { student, kpis, strengths, weaknesses, weekly_activity, quiz_trend, recommendations, subject_mastery } = data;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Ready for advanced practice':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Developing understanding':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sample Data Disclosure Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
            DEMO ENVIRONMENT
          </span>
          <span>
            Displaying realistic sample data for student <strong>{student.name}</strong> ({student.current_semester}).
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Target Goal: <span className="font-medium text-slate-700">{student.target_goal}</span>
        </span>
      </div>

      {/* Hero Welcome & Learning Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" /> AI-Guided Student Success
              </span>
              <span className="bg-indigo-800/60 text-indigo-200 border border-indigo-700/60 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Student: {student.name} ({student.current_semester})
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">{student.name}</span>!
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Your personalized multi-agent learning engine has synthesized your diagnostic quiz outcomes and scheduled your daily study priorities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('learn')}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Start Practice Quiz
            </button>
            <button
              onClick={() => onNavigate('agents')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-teal-400" /> View Agent Orchestrator
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Average Score */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Quiz Score</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{kpis.average_quiz_score}%</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 3 technical domains</p>
        </div>

        {/* Card 2: Learning Streak */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{kpis.learning_streak_days} Days</span>
            <span className="text-xs text-amber-600 font-semibold">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Daily consistency target met</p>
        </div>

        {/* Card 3: Total Sessions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Quizzes</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{kpis.total_learning_sessions}</span>
            <span className="text-xs text-slate-500 font-medium">Recorded</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified SQLite persistence</p>
        </div>

        {/* Card 4: Practice Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan Completion</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{Math.round(kpis.practice_completion_rate * 100)}%</span>
            <span className="text-xs text-emerald-600 font-semibold">On Track</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tasks completed in current sprint</p>
        </div>
      </div>

      {/* Machine Learning Support Tier Diagnostic Highlight */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-teal-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                <BrainCircuit className="w-4 h-4 text-indigo-600" /> Scikit-Learn Predictive Model
              </span>
              <span className="text-slate-400 text-xs">• 88.3% Test Accuracy</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                Current Support Tier:
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getTierColor(kpis.ml_support_tier)}`}>
                {kpis.ml_support_tier} ({Math.round(kpis.ml_confidence * 100)}% confidence)
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Based on your quiz trajectory, practice completion ({Math.round(kpis.practice_completion_rate * 100)}%), and study time, our trained Random Forest classifier recommends focused practice on intermediate concepts before advancing to full projects.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => onNavigate('progress')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Explore ML Explainability <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Hours & Tasks */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Study Activity</h3>
              <p className="text-xs text-slate-500">Study hours spent per day this week</p>
            </div>
            <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              Goal: 2.5 hrs/day
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="study_hours" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Study Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Timeline */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Quiz Score Progression</h3>
              <p className="text-xs text-slate-500">Historical performance trend over attempts</p>
            </div>
            <div className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
              Target: ≥ 80%
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quiz_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="index" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value}%`, 'Score']}
                  labelFormatter={(label) => `Attempt #${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ fill: '#0d9488', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Quiz Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Section: Adaptive Recommendations & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Adaptive Recommendations (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" /> Recommended Next Actions
              </h3>
              <p className="text-xs text-slate-500">
                Generated dynamically from your weak topics and recorded quiz results
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Updated just now</span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {rec.topic}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {rec.action_type}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rec.estimated_minutes} min
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700 font-semibold">Why recommended: </strong>
                    {rec.reason}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (rec.target_url.startsWith('/quiz')) {
                      onNavigate('learn');
                    } else if (rec.target_url.startsWith('/tutor')) {
                      onNavigate('tutor');
                    } else {
                      onNavigate('planner');
                    }
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 self-start sm:self-center whitespace-nowrap cursor-pointer"
                >
                  Start Action <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Subject Mastery & Weaknesses (1/3 width) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Topic Mastery Status</h3>
            <p className="text-xs text-slate-500">Based on diagnostic quiz outcomes</p>
          </div>

          <div className="space-y-4">
            {subject_mastery.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{sub.topic}</span>
                  <span className="font-bold text-indigo-600">{sub.average_score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      sub.average_score >= 80 ? 'bg-emerald-500' : sub.average_score >= 65 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${sub.average_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{sub.attempts} attempts recorded</span>
                  <span className={sub.status === 'Mastered' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed Strengths
              </span>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-inside">
                {strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Focus Improvement Gaps
              </span>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-inside">
                {weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
