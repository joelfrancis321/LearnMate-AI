import React, { useState, useEffect, useRef } from 'react';
import { TutorResponse } from '../types';
import { askTutor, fetchSuggestedPrompts } from '../api';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  BookOpen,
  Info,
  Lightbulb,
  Code2,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  data?: TutorResponse;
  timestamp: string;
}

export const AiTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'tutor',
      text:
        'Hello! I am your LearnMate Academic AI Tutor. I specialize in Python Programming, Machine Learning Fundamentals, and Data Structures & Algorithms. Ask me about supervised learning, decision tree splitting, precision/recall, BFS vs DFS, or Python list comprehensions!',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadPrompts = async () => {
    try {
      const res = await fetchSuggestedPrompts();
      setSuggestedPrompts(res.prompts);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const tutorRes = await askTutor(textToSend);
      const tutorMsg: ChatMessage = {
        id: `tutor_${Date.now()}`,
        sender: 'tutor',
        text: tutorRes.explanation,
        data: tutorRes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'tutor',
        text: "I encountered a local retrieval error. Please ensure the backend server is running and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header & Source Transparency Notice */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-teal-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Curated Local Knowledge Base
            </span>
            <span className="text-slate-400 text-xs">• 100% Offline & Non-Fabricating</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">AI Tutor Interactive Chat</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explains concepts, illustrates code patterns, and grounds answers in verified academic sources.
          </p>
        </div>

        <div className="text-right text-[11px] text-slate-400 hidden sm:block">
          <div>Powered by Scikit-Learn TF-IDF</div>
          <div className="font-semibold text-slate-600">Local Semantic Matcher</div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick Educational Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isStudent = msg.sender === 'student';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isStudent ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-teal-500 to-indigo-600 text-white'
                  }`}
                >
                  {isStudent ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                    isStudent
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Topic badge for tutor message */}
                  {!isStudent && msg.data?.topic && (
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {msg.data.topic}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {msg.data.source}
                      </span>
                    </div>
                  )}

                  {/* Body text with paragraph rendering */}
                  <div className="whitespace-pre-line font-normal">{msg.text}</div>

                  {/* Code Snippet Box */}
                  {!isStudent && msg.data?.code_snippet && (
                    <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-teal-400" /> Python Implementation
                        </span>
                        <button
                          onClick={() => handleCopyCode(msg.data!.code_snippet!, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 overflow-x-auto text-emerald-300/90 leading-relaxed">
                        {msg.data.code_snippet}
                      </pre>
                    </div>
                  )}

                  {/* Key Takeaway */}
                  {!isStudent && msg.data?.key_takeaway && (
                    <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-teal-900 text-xs flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-teal-950">Key Takeaway: </strong>
                        {msg.data.key_takeaway}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] text-right ${isStudent ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                Searching local curated repository...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Field */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question about Python, ML algorithms, or Big-O notation..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
