import React from 'react';
import {
  Award,
  BookOpen,
  BrainCircuit,
  Bot,
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  Target,
  ExternalLink,
  Presentation,
  FileCheck,
  Sparkles
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  const deliverables = [
    {
      title: 'Lean Canvas (One-Page Business & Impact Model)',
      filename: 'lean_canvas.pdf',
      format: 'PDF Document',
      description: 'Single-page business and social impact model covering all 9 Lean Canvas blocks, SDG 4 impact, channels, and sustainability.',
      icon: FileCheck,
      downloadUrl: '/api/docs/download/lean_canvas.pdf',
    },
    {
      title: 'Formal Project Concept Note',
      filename: 'concept_note.pdf',
      format: 'PDF Document',
      description: 'Comprehensive academic concept note detailing problem statement, system architecture, agent workflows, and ethical limitations.',
      icon: FileText,
      downloadUrl: '/api/docs/download/concept_note.pdf',
    },
    {
      title: 'PowerPoint Project Presentation (12 Slides)',
      filename: 'project_presentation.pptx',
      format: 'Editable PPTX',
      description: 'Polished 12-slide presentation deck covering problem, architecture, ML metrics, multi-agent orchestrator, and demo flow.',
      icon: Presentation,
      downloadUrl: '/api/docs/download/project_presentation.pptx',
    },
    {
      title: 'Technical Project Final Report',
      filename: 'project_report.pdf',
      format: 'PDF Document',
      description: 'In-depth engineering documentation with API specifications, database ER diagram, test cases, and reproducibility commands.',
      icon: BookOpen,
      downloadUrl: '/api/docs/download/project_report.pdf',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> BharatCares Internship Project
            </span>
            <span className="bg-indigo-500/30 text-teal-200 border border-teal-400/50 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Candidate: Joel Francis (B.Tech CSE)
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              UN SDG 4: Quality Education
            </span>
            <span className="text-slate-400 text-xs">Duration: 24 August – 30 September 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            LearnMate AI: Your Personal AI Learning & Student Success Companion
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            An intelligent educational platform that analyzes quiz performance, estimates student learning needs using real Scikit-Learn machine learning, recommends personalized study activities, and coordinates specialized local AI agents for tutoring, quizzes, progress analysis, and career guidance.
          </p>
        </div>
      </div>

      {/* Deliverables Download Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" /> Mandatory Internship Deliverables
            </h2>
            <p className="text-xs text-slate-500">
              Download the formal submission files generated specifically for this project.
            </p>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded font-bold">
            All 4 Files Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliverables.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {doc.format}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{doc.filename}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{doc.description}</p>
                </div>

                <a
                  href={doc.downloadUrl}
                  download={doc.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download {doc.format}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem, Solution & SDG 4 Alignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">The Core Problem</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineering students struggle to pinpoint knowledge gaps, maintain regular study discipline, and choose actionable resources from scattered tutorials without expensive 1-on-1 tutoring.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Proposed Solution</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            LearnMate AI integrates interactive assessments with a trained Random Forest classification model to estimate learning support tiers and coordinates 5 specialized local agents to guide study and career tracks.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">UN SDG 4 Alignment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Directly supports UN Sustainable Development Goal 4 (Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all) by democratizing high-quality, personalized tutoring.
          </p>
        </div>
      </div>

      {/* Technical Architecture Overview */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900">Technical Architecture & Stack</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-indigo-700 block uppercase tracking-wider text-[11px]">Frontend</span>
            <div className="font-semibold text-slate-800">React 19 + TypeScript + Vite</div>
            <div className="text-slate-500">Tailwind CSS v4, Lucide Icons, Recharts interactive data visualization.</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-indigo-700 block uppercase tracking-wider text-[11px]">Backend API</span>
            <div className="font-semibold text-slate-800">FastAPI + Pydantic + Uvicorn</div>
            <div className="text-slate-500">Asynchronous REST endpoints, CORS middleware, interactive Swagger documentation.</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-indigo-700 block uppercase tracking-wider text-[11px]">Machine Learning</span>
            <div className="font-semibold text-slate-800">Scikit-Learn Random Forest</div>
            <div className="text-slate-500">88.3% test accuracy, train/test stratified split, transparent feature importances.</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-indigo-700 block uppercase tracking-wider text-[11px]">Local Multi-Agent</span>
            <div className="font-semibold text-slate-800">5 Specialized Agents</div>
            <div className="text-slate-500">Orchestrator, Tutor, Quiz, Analyst, Planner, and Career agents with audit logging.</div>
          </div>
        </div>
      </div>

      {/* Honest Disclosures & Ethical Considerations */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-700 space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Academic & Ethical Disclosures
        </h4>
        <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed">
          <li>
            <strong>Synthetic Dataset Provenance:</strong> The student dataset of 1,200 records was synthetically generated using calibrated distributions to model realistic student test variations and progress trajectories for prototype development.
          </li>
          <li>
            <strong>Local Offline Operation:</strong> All agents and knowledge retrieval operate locally via deterministic rules, TF-IDF matching, and curated repositories without requiring paid external LLM APIs (OpenAI/Anthropic).
          </li>
          <li>
            <strong>Ethical Assessment Safeguard:</strong> The machine learning classification is utilized strictly for recommending educational review pacing and resources. It is not an assessment of general intelligence or academic capability.
          </li>
        </ul>
      </div>
    </div>
  );
};
