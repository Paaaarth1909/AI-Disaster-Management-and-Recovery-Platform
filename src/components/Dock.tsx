import React, { useState } from 'react';
import { 
  Map, 
  Globe2, 
  BarChart2, 
  Users, 
  Box, 
  AlertTriangle, 
  MessageSquare, 
  Bot, 
  Brain,
  X,
  Send,
  Radio,
  Shield,
  Truck,
  Wind
} from 'lucide-react';
import AIChat from './AIChat';
import { useDisasterStore } from '../store/disaster';

interface DockProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface Communication {
  id: string;
  type: 'message' | 'alert' | 'update';
  sender: string;
  content: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

const initialCommunications: Communication[] = [
  { id: '1', type: 'alert', sender: 'State Emergency Ops', content: 'Immediate evacuation siren triggered for coastal corridors', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), priority: 'high' },
  { id: '2', type: 'message', sender: 'Rapid Response Unit 1', content: 'Water rescue boat deployed to Aluva lowlands. 24 civilians extracted safely.', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), priority: 'medium' },
  { id: '3', type: 'update', sender: 'Doppler Radar Hub', content: 'Precipitation intensity peaking at 120mm/hr in sector 3', timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(), priority: 'high' }
];

export default function Dock({ activeView, onViewChange }: DockProps) {
  const { teams, resources, disasters } = useDisasterStore();
  const [showPanel, setShowPanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [panelView, setPanelView] = useState<string>('');
  const [comms, setComms] = useState<Communication[]>(initialCommunications);
  const [newMsg, setNewMsg] = useState('');

  const menuItems = [
    { id: 'chat', icon: Bot, label: 'AI Copilot' },
    { id: 'map', icon: Map, label: 'Tactical Map' },
    { id: 'globe', icon: Globe2, label: '3D Globe' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'ai-analysis', icon: Brain, label: 'AI Triage' },
    { id: 'teams', icon: Users, label: 'Units', badge: teams.length },
    { id: 'resources', icon: Box, label: 'Stockpiles', badge: resources.length },
    { id: 'incidents', icon: AlertTriangle, label: 'Incidents', badge: disasters.length },
    { id: 'communications', icon: MessageSquare, label: 'Comms', badge: comms.length }
  ];

  const handleViewChange = (view: string) => {
    if (view === 'chat') {
      setShowChat(!showChat);
      if (showPanel) setShowPanel(false);
    } else if (['teams', 'resources', 'incidents', 'communications'].includes(view)) {
      if (showPanel && panelView === view) {
        setShowPanel(false);
      } else {
        setShowPanel(true);
        setPanelView(view);
      }
      if (showChat) setShowChat(false);
    } else {
      onViewChange(view);
      setShowPanel(false);
    }
  };

  const handleSendComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const item: Communication = {
      id: `comm-${Date.now()}`,
      type: 'message',
      sender: 'EOC Admin Dispatch',
      content: newMsg,
      timestamp: new Date().toISOString(),
      priority: 'high'
    };
    setComms([item, ...comms]);
    setNewMsg('');
  };

  const renderPanelContent = () => {
    switch (panelView) {
      case 'teams':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Emergency Response Personnel</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {teams.filter(t => t.status === 'responding').length} Deployments Active
              </span>
            </div>
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {teams.map(team => (
                <div key={team.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{team.name}</h4>
                    <p className="text-xs text-slate-400">Sector: {team.location_name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {team.specializations?.map((sp, i) => (
                        <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {sp.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase font-semibold block mb-1 ${
                      team.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      team.status === 'responding' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {team.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {team.current_members} / {team.capacity} crew
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Box className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Stockpiles & Relief Supplies</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {resources.length} Warehouses Tracked
              </span>
            </div>
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {resources.map(res => (
                <div key={res.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {res.type === 'medical' ? <Shield className="w-4 h-4 text-rose-400" /> :
                       res.type === 'water' ? <Wind className="w-4 h-4 text-cyan-400" /> :
                       res.type === 'transport' ? <Truck className="w-4 h-4 text-emerald-400" /> :
                       <Box className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{res.name}</h4>
                      <p className="text-xs text-slate-400">{res.location_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white text-sm block font-mono">
                      {res.quantity.toLocaleString()} {res.unit}
                    </span>
                    <span className={`text-[10px] uppercase font-mono font-semibold ${
                      res.status === 'deployed' ? 'text-cyan-400' :
                      res.status === 'in-transit' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      &bull; {res.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'incidents':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base text-white">Active Catastrophes</h3>
              </div>
              <span className="text-xs font-mono text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                {disasters.length} Monitored
              </span>
            </div>
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {disasters.map(d => (
                <div key={d.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                        d.severity >= 4 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        Level {d.severity}
                      </span>
                      <h4 className="font-semibold text-white text-sm">{d.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Sector: {d.location_name} &bull; Radius: {d.affected_radius_km} km</p>
                  </div>
                  <button
                    onClick={() => {
                      onViewChange('map');
                      setShowPanel(false);
                    }}
                    className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 text-xs rounded-lg transition-colors font-medium"
                  >
                    Locate
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'communications':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-bold text-base text-white">Tactical Dispatch Terminal</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">ENCRYPTED OPERATOR CHANNEL</span>
            </div>

            {/* Quick Dispatch Input */}
            <form onSubmit={handleSendComm} className="flex space-x-2">
              <input
                type="text"
                placeholder="Broadcast operational field dispatch message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 bg-[#030712] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 glass-btn-primary text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

            <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
              {comms.map(c => (
                <div key={c.id} className="p-3 bg-[#030712]/70 rounded-xl border border-white/[0.08] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400">{c.sender}</span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(c.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Center Dock Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-[calc(100vw-1.5rem)]">
        <div className="flex items-center space-x-1 sm:space-x-1.5 glass-panel rounded-2xl p-1.5 sm:p-2 border border-white/[0.12] shadow-2xl shadow-black/90">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'chat' 
              ? showChat 
              : ['teams', 'resources', 'incidents', 'communications'].includes(item.id)
              ? showPanel && panelView === item.id
              : activeView === item.id && !showPanel;

            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`relative group p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-[#030712] font-bold shadow-lg shadow-emerald-500/40 scale-105'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}

                {/* Badge if provided */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-mono font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-950/95 border border-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Panel Drawer */}
      {showPanel && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-40 px-4 animate-in fade-in slide-in-from-bottom-4 duration-150">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {renderPanelContent()}
          </div>
        </div>
      )}

      {/* Floating AI Chat Window if opened from dock */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] z-50 shadow-2xl">
          <AIChat onClose={() => setShowChat(false)} />
        </div>
      )}
    </>
  );
}
