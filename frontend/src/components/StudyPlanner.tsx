import React, { useState, useEffect } from 'react';
import { StudyPlanData, StudyTask } from '../types';
import {
  fetchActivePlan,
  createStudyPlan,
  toggleTaskCompletion
} from '../api';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
  PlusCircle,
  Target,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface StudyPlannerProps {
  onPlanUpdated: () => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ onPlanUpdated }) => {
  const [planData, setPlanData] = useState<StudyPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states for creating a new adaptive plan
  const [subject, setSubject] = useState('Machine Learning & Python Engineering');
  const [targetGoal, setTargetGoal] = useState('Crack Technical AI Developer Interview');
  const [deadlineDays, setDeadlineDays] = useState(14);
  const [dailyHours, setDailyHours] = useState(2.5);

  useEffect(() => {
    loadActivePlan();
  }, []);

  const loadActivePlan = async () => {
    try {
      setLoading(true);
      const res = await fetchActivePlan('STU_DEMO_01');
      setPlanData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      await createStudyPlan({
        student_id: 'STU_DEMO_01',
        subject,
        target_goal: targetGoal,
        deadline_days: Number(deadlineDays),
        daily_hours: Number(dailyHours),
      });
      await loadActivePlan();
      onPlanUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (task: StudyTask) => {
    const newStatus = task.is_completed === 0;
    try {
      // Optimistic local update
      if (planData) {
        const updatedTasks = planData.tasks.map((t) =>
          t.id === task.id ? { ...t, is_completed: newStatus ? 1 : 0 } : t
        );
        const doneCount = updatedTasks.filter((t) => t.is_completed === 1).length;
        const total = updatedTasks.length;
        setPlanData({
          ...planData,
          completed_tasks: doneCount,
          completion_rate_percent: Math.round((doneCount / total) * 100),
          tasks: updatedTasks,
        });
      }

      await toggleTaskCompletion(task.id, newStatus);
      onPlanUpdated();
    } catch (err) {
      console.error(err);
      loadActivePlan();
    }
  };

  if (loading && !planData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading active study plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
              Adaptive Curriculum Architect
            </span>
            <span className="text-slate-400 text-xs">• Prioritizes Diagnosed Weak Topics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Personalized Study Planner</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generates milestone-driven daily checklists tailored to your goals and available time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Plan Generator / Customizer */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-600" /> Configure Study Sprint
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The Study Planner Agent will auto-allocate your diagnosed gaps.
            </p>
          </div>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject Track
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Milestone Goal
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Timeline (Days)
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Daily Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Synthesizing Schedule...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  Generate Adaptive Plan
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-600" /> Adaptive Rule:
            </div>
            <p className="leading-relaxed text-[11px]">
              The Planner agent automatically shifts more time to your lowest-scoring topics (e.g. Data Structures & Algorithm traversals) during the first 3 days.
            </p>
          </div>
        </div>

        {/* Right 2-Cols: Active Plan View & Checklist */}
        <div className="lg:col-span-2 space-y-5">
          {planData?.has_plan && planData.plan ? (
            <>
              {/* Active Plan Meta Card */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-900/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                        Active Sprint
                      </span>
                      <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                        Student: Joel Francis
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white">{planData.plan.subject}</h2>
                    <p className="text-xs text-slate-300">
                      Goal: <span className="text-teal-200 font-semibold">{planData.plan.target_goal}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Date</span>
                      <span className="font-mono font-bold text-white">{planData.plan.deadline_date}</span>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Daily Time</span>
                      <span className="font-bold text-white">{planData.plan.daily_hours} hrs/day</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Sprint Completion</span>
                    <span className="font-bold text-teal-300">
                      {planData.completed_tasks} / {planData.total_tasks} Tasks ({planData.completion_rate_percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${planData.completion_rate_percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tasks Daily Checklist */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">Study Tasks Checklist</h3>
                  <span className="text-xs text-slate-500">Click checkboxes to record completion</span>
                </div>

                <div className="space-y-3">
                  {planData.tasks.map((task) => {
                    const isDone = task.is_completed === 1;
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isDone
                            ? 'bg-slate-50 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-800 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}} // handled by div click
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                Day {task.day_number}
                              </span>
                              <span className="text-[11px] font-semibold text-indigo-700">
                                {task.topic}
                              </span>
                            </div>
                            <h4 className={`text-xs sm:text-sm font-semibold mt-0.5 ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.estimated_minutes} min</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4">
              <CalendarCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Active Study Plan Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use the generator panel on the left to synthesize an adaptive study schedule. The Study Planner Agent will allocate daily study hours towards your diagnosed weak areas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
