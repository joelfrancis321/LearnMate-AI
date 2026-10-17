import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LearnPractice } from './components/LearnPractice';
import { AiTutor } from './components/AiTutor';
import { StudyPlanner } from './components/StudyPlanner';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { AgentActivity } from './components/AgentActivity';
import { AboutProject } from './components/AboutProject';
import { DashboardSummary } from './types';
import { fetchDashboardSummary, resetDemoData } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoadingDashboard(true);
      const data = await fetchDashboardSummary('STU_DEMO_01');
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleResetDemo = async () => {
    if (isResetting) return;
    try {
      setIsResetting(true);
      const res = await resetDemoData();
      await loadDashboard();
      setResetNotice(res.message);
      setTimeout(() => setResetNotice(null), 4000);
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Reset Toast Notification */}
      {resetNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-teal-300 px-4 py-2.5 rounded-xl border border-teal-500/50 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>✓</span> {resetNotice}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            data={dashboardData}
            loading={loadingDashboard}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'learn' && (
          <LearnPractice
            onQuizCompleted={loadDashboard}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'tutor' && <AiTutor />}

        {activeTab === 'planner' && <StudyPlanner onPlanUpdated={loadDashboard} />}

        {activeTab === 'progress' && <ProgressAnalytics />}

        {activeTab === 'agents' && <AgentActivity />}

        {activeTab === 'about' && <AboutProject />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">LearnMate AI</span>
            <span>• BharatCares Machine Learning & Applied AI Internship</span>
          </div>
          <div className="text-slate-400">
            UN SDG 4: Quality Education • Built with React 19, FastAPI, & Scikit-Learn
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
