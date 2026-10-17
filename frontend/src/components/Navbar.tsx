import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquareCode,
  CalendarCheck2,
  LineChart,
  Bot,
  Info,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  isResetting,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn & Practice', icon: GraduationCap },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquareCode },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck2 },
    { id: 'progress', label: 'My Progress', icon: LineChart },
    { id: 'agents', label: 'Agent Activity', icon: Bot },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Program Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-xs py-1.5 px-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
            <Award className="w-3.5 h-3.5 text-teal-300" /> BharatCares Internship Project
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">Machine Learning & Applied AI</span>
          <span className="hidden md:inline text-slate-500">• 24 Aug – 30 Sep 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/60 text-[11px] font-medium">
            🎯 UN SDG 4: Quality Education
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-900/90 border border-teal-400/60 text-teal-300 font-bold text-xs shadow-sm">
            🎓 Candidate: Joel Francis (B.Tech CSE)
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">LearnMate</span>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                Personal AI Learning Companion
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/30 text-teal-300 border border-teal-500/40 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Area: Reset Data & Profile Badge */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetDemo}
              disabled={isResetting}
              title="Reset sample data back to standard demo state"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-slate-400 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 text-slate-950 font-black text-xs flex items-center justify-center ring-2 ring-teal-400/50 shadow-md">
                JF
              </div>
              <div className="text-left text-xs">
                <div className="font-extrabold text-white text-xs leading-tight">Joel Francis</div>
                <div className="text-[10px] text-teal-300 font-semibold leading-tight">B.Tech CSE Demo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroll */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 space-x-1.5 bg-slate-950/70 border-t border-slate-800/60 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
