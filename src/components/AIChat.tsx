import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader, X, Minimize2, Maximize2, Sparkles, Compass, ShieldAlert, Users, Layers, Info } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import { generateChatResponse, getGeminiKeyStatus } from '../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PRESET_PROMPTS = [
  {
    title: "SitRep Summary",
    prompt: "Provide an executive situation report on all currently active catastrophes and highest severity threats.",
    icon: Compass
  },
  {
    title: "Logistics Shortages",
    prompt: "Analyze our supply reserves versus affected populations. Which sectors have critical medical or food deficits?",
    icon: Layers
  },
  {
    title: "Rescue Deployments",
    prompt: "Review emergency response teams in the field. Are rescue personnel sufficient for current flood zones?",
    icon: Users
  },
  {
    title: "Evacuation Priority",
    prompt: "What areas need mandatory evacuation right now and what sirens have been dispatched?",
    icon: ShieldAlert
  }
];

interface AIChatProps {
  onClose?: () => void;
}

export default function AIChat({ onClose }: AIChatProps) {
  const { disasters, resources, teams, alerts } = useDisasterStore();
  const keyStatus = getGeminiKeyStatus();
  const [showKeyBanner, setShowKeyBanner] = useState(!keyStatus.isConfigured);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Command Terminal Initialized. I am your Gemini AI Disaster Intelligence Assistant. I am live-connected to active sensor feeds, response teams, and resource inventories.\n\nHow can I support your operational decision-making right now?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateChatResponse({
        prompt: textToSend,
        context: {
          disasters,
          resources,
          teams,
          alerts
        }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I encountered an issue processing real-time telemetry. If using custom credentials, verify your VITE_GEMINI_API_KEY in .env. Meanwhile, operational data remains active in your dashboard.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="bg-slate-900/95 hover:bg-slate-800 backdrop-blur-2xl border border-blue-500/50 rounded-2xl p-3.5 flex items-center space-x-3 text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400">
          <Bot className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
            <span>AI Copilot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h4>
          <p className="text-[10px] text-slate-400">Click to expand terminal</p>
        </div>
        <Maximize2 className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  return (
    <div 
      ref={chatRef}
      className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px] w-full text-white animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white tracking-tight">Gemini AI Copilot</h3>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                keyStatus.isValid
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}>
                {keyStatus.isValid ? 'GEMINI 1.5 LIVE' : 'TACTICAL SIM'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {keyStatus.isValid ? 'Google AI Studio Active' : 'Emergency Telemetry Engine'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advisory Banner if Key is not configured */}
      {showKeyBanner && (
        <div className="px-3.5 py-2 bg-blue-950/60 border-b border-blue-800/60 flex items-start justify-between gap-2 text-[10px] text-blue-200">
          <div className="flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-300">Telemetry Engine Standby</p>
              <p className="text-blue-300/80 leading-normal">
                To enable live cloud neural inference, configure <code className="bg-blue-900/60 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> in <code className="bg-blue-900/60 px-1 py-0.5 rounded">.env</code>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowKeyBanner(false)}
            className="text-blue-400 hover:text-white p-0.5"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Preset Action Chips */}
      <div className="p-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto">
        <div className="flex gap-1.5">
          {PRESET_PROMPTS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(preset.prompt)}
                disabled={loading}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-[11px] font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-blue-400" />
                <span>{preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-950/80 text-slate-200 border border-slate-800'
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
              <span className="text-[9px] text-slate-400 mt-1 block font-mono text-right opacity-70">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center space-x-2 text-xs text-slate-300">
              <Loader className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span className="font-mono text-[11px]">Synthesizing telemetry data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about evacuation, supplies, or hazards..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
