import { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Globe2, 
  MapPin, 
  Sparkles, 
  Box, 
  Users, 
  BarChart3, 
  ArrowRight,
  Terminal
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectAction }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const ACTIONS = [
    {
      id: 'dispatch_sirens',
      title: 'TRIGGER MASS CIVILIAN SIRENS',
      desc: 'Broadcast emergency CAP cellular alert and siren arrays across all coastal sectors',
      category: 'TACTICAL ALERT',
      icon: Radio,
      color: 'text-red-400 bg-red-950/40 border-red-500/30'
    },
    {
      id: 'view_globe',
      title: 'ORBITAL JUMP TO 3D HOLO-GLOBE',
      desc: 'Engage WebGL planetary crisis recon with real-time hazard markers',
      category: 'GEOSPATIAL',
      icon: Globe2,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
    },
    {
      id: 'view_map',
      title: 'SWITCH TO 2D VECTOR TACTICAL MAP',
      desc: 'Inspect high-resolution Mapbox v3 evacuation zones and hazard corridors',
      category: 'GEOSPATIAL',
      icon: MapPin,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
    },
    {
      id: 'open_ai_copilot',
      title: 'EXECUTE AI SITREP DEBRIEF',
      desc: 'Query Gemini 1.5 Flash for live casualty synthesis and logistics deficits',
      category: 'NEURAL AI',
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30'
    },
    {
      id: 'add_supplies',
      title: 'MOBILIZE RELIEF STOCKPILE DEPOT',
      desc: 'Requisition emergency medical trauma beds, Zodiac rafts, and potable water',
      category: 'LOGISTICS',
      icon: Box,
      color: 'text-amber-400 bg-amber-950/40 border-amber-500/30'
    },
    {
      id: 'report_incident',
      title: 'TRANSMIT CITIZEN INCIDENT REPORT',
      desc: 'Ingest crowdsourced geo-tagged eyewitness report into PostGIS database',
      category: 'CIVIL DEFENSE',
      icon: Users,
      color: 'text-zinc-300 bg-zinc-900 border-white/10'
    },
    {
      id: 'view_analytics',
      title: 'RENDER TELEMETRY INCIDENT CHARTS',
      desc: 'Inspect 24-hour disaster severity breakdown and logistics readiness graphs',
      category: 'ANALYTICS',
      icon: BarChart3,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = ACTIONS.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.desc.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      
      {/* Modal Dialog */}
      <div 
        className="w-full max-w-2xl glass-panel rounded-2xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#030712]/90">
          <Terminal className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a tactical command or search action (e.g. Sirens, Globe, AI)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-zinc-500 hover:text-white mr-2 text-xs">
              CLEAR
            </button>
          )}
          <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-zinc-400">
            <span>ESC</span>
          </div>
        </div>

        {/* Action Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">
              No matching tactical directives found.
            </div>
          ) : (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    onSelectAction(action.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-3">
                    <div className={`p-2 rounded-lg border ${action.color} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold font-mono tracking-wide text-white group-hover:text-emerald-300 transition-colors">
                          {action.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-400">
                          {action.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2 bg-[#02050e] border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center space-x-3">
            <span>Navigate: <strong className="text-zinc-400">↑ ↓</strong></span>
            <span>Execute: <strong className="text-zinc-400">ENTER</strong></span>
          </div>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>EOC SYSTEM READY</span>
          </span>
        </div>
      </div>

    </div>
  );
}
