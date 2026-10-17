import React, { useState, useEffect } from 'react';
import {
  fetchAgentCatalog,
  fetchAgentLogs,
  executeAgentWorkflow
} from '../api';
import {
  AgentWorkflowResult,
  AgentLogItem
} from '../types';
import {
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AgentActivity: React.FC = () => {
  const [catalog, setCatalog] = useState<any>(null);
  const [logs, setLogs] = useState<AgentLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestText, setRequestText] = useState(
    'Diagnose my weak areas and build me a targeted review blueprint'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecution, setCurrentExecution] = useState<AgentWorkflowResult | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, logsRes] = await Promise.all([
        fetchAgentCatalog(),
        fetchAgentLogs(),
      ]);
      setCatalog(catRes);
      setLogs(logsRes.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunWorkflow = async (prompt?: string) => {
    const text = prompt || requestText;
    if (!text.trim() || isExecuting) return;

    try {
      setIsExecuting(true);
      const res = await executeAgentWorkflow(text, 'STU_DEMO_01');
      setCurrentExecution(res);
      // Refresh logs
      const updatedLogs = await fetchAgentLogs();
      setLogs(updatedLogs.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const presetWorkflows = [
    {
      title: 'Composite Diagnostic & Study Blueprint',
      prompt: 'Diagnose my weak areas, retrieve foundational concept notes, and build me an adaptive 5-day study plan',
      agents: ['Learning Analyst Agent', 'Tutor Agent', 'Study Planner Agent'],
    },
    {
      title: 'Pedagogical Concept & Practice Assessment',
      prompt: 'Teach me supervised vs unsupervised learning and generate a 3-question diagnostic quiz',
      agents: ['Tutor Agent', 'Quiz Agent'],
    },
    {
      title: 'Competency Analysis & Career Roadmapping',
      prompt: 'Assess my verified strengths and recommend an AI / Machine Learning Engineer career roadmap',
      agents: ['Learning Analyst Agent', 'Career Guide Agent'],
    },
  ];

  if (loading && !catalog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Connecting to Agent Orchestration Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200 flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-indigo-600" /> Multi-Agent Orchestrator
          </span>
          <span className="text-slate-400 text-xs">• 5 Specialized Local Agents</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1">Agent Activity & Orchestration Workbench</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect autonomous agent collaboration, task decomposition, inter-agent data passing, and fallback monitoring.
        </p>
      </div>

      {/* Agents Catalog Row */}
      {catalog?.agents && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {catalog.agents.map((agent: any) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                  Ready
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{agent.name}</h4>
              <p className="text-[11px] text-slate-500 leading-snug line-clamp-3">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Workflow Execution Terminal */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" /> Dispatch Orchestrator Request
            </h3>
            <p className="text-xs text-slate-500">
              The orchestrator will parse intent, generate task plans, and coordinate agent execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Fallback Policy:</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Local Rule-Based Recovery
            </span>
          </div>
        </div>

        {/* Preset Workflow Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            One-Click Preset Workflows:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetWorkflows.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setRequestText(preset.prompt);
                  handleRunWorkflow(preset.prompt);
                }}
                disabled={isExecuting}
                className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="Describe what you need the agent collective to do..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <button
            onClick={() => handleRunWorkflow()}
            disabled={isExecuting || !requestText.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {isExecuting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Orchestrating...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Execute Workflow
              </>
            )}
          </button>
        </div>

        {/* Live Execution Results Stepper */}
        {currentExecution && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                    Execution Report
                  </span>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    Student: Joel Francis
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  {currentExecution.workflow_type}
                </h4>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Latency</span>
                  <span className="text-teal-300 font-bold">{currentExecution.total_latency_ms} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status</span>
                  <span className="text-emerald-400 font-bold">{currentExecution.execution_status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Fallback Used</span>
                  <span className={currentExecution.fallback_used ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {currentExecution.fallback_used ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Task Decomposition & Sequence:
              </span>
              <div className="space-y-2.5">
                {currentExecution.steps.map((st) => (
                  <div
                    key={st.step}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 font-mono font-bold text-[10px] flex items-center justify-center border border-teal-500/30">
                          {st.step}
                        </span>
                        <span className="font-bold text-teal-200">{st.agent_name}</span>
                        <span className="text-slate-400 text-[11px]">• {st.role_description}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{st.latency_ms}ms</span>
                    </div>
                    <p className="text-slate-300 text-xs pl-7 leading-relaxed">{st.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical Audit Logs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" /> Historical Orchestration Logs
          </h3>
          <span className="text-xs text-slate-500 font-medium">Logged to SQLite <code>agent_logs</code></span>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div key={log.id} className="py-3.5 space-y-2">
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50/70 p-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {log.workflow_type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {log.latency_ms}ms
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">
                        {log.execution_status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 font-medium">{log.request_text}</div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span>{log.created_at?.slice(0, 16)}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono space-y-2 overflow-x-auto">
                    <div className="text-[11px] text-teal-400 font-bold">
                      Agents: {log.agents_involved.join(' → ')}
                    </div>
                    <pre className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(log.result_details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
