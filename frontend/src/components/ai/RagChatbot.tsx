import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, BookOpen, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { document: string; section: string; relevance: number }[];
  timestamp: Date;
}

export const RagChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m the Industrial Copilot RAG Assistant. Ask me about safety procedures, machine protocols, emergency plans, or any factory documentation.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await api.queryRAG(query);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.answer,
        sources: result.sources,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '⚠ Unable to reach the RAG engine. Please ensure the backend is running.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Fire evacuation protocol',
    'Machine M-04 shutdown procedure',
    'Cyber intrusion response steps',
    'PPE requirements for Zone B',
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 dark:bg-slate-600 rotate-90 scale-95'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:scale-110 shadow-cyan-500/30 dark:shadow-cyan-500/40'
        }`}
        title="RAG Knowledge Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/60 animate-float-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-700 dark:to-blue-800 px-5 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white tracking-wide">
                RAG Knowledge Assistant
              </h3>
              <p className="text-[10px] text-cyan-100/80 font-mono">
                Industrial Safety & Procedures Corpus
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-slate-900 max-h-[340px] min-h-[200px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-300/40 dark:border-slate-600/40 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Sources
                      </span>
                      {msg.sources.map((src, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3 h-3 flex-shrink-0" />
                          <span>
                            {src.document} {src.section}{' '}
                            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                              ({Math.round(src.relevance * 100)}%)
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Searching knowledge base…
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (shown when conversation is fresh) */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Quick Queries</p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about procedures, safety protocols…"
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
