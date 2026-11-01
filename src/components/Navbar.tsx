import { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  HelpCircle, 
  User, 
  LogOut, 
  Bot, 
  Clock, 
  CheckCheck,
  Volume2,
  VolumeX,
  Home,
  Shield,
  Command,
  ChevronDown
} from 'lucide-react';
import AIChat from './AIChat';
import CommandPalette from './CommandPalette';
import { useDisasterStore } from '../store/disaster';

interface NotificationItem {
  id: string;
  type: 'alert' | 'update' | 'info';
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Severe Cyclone Tracking Update',
    message: 'Storm system accelerating towards Chennai coast. Gusts reaching 180 km/h.',
    time: '2 mins ago',
    read: false
  },
  {
    id: '2',
    type: 'alert',
    title: 'Kerala Flood Spillway Warning',
    message: 'Dam water level at 95% capacity. Secondary sirens activated in lower basin.',
    time: '15 mins ago',
    read: false
  },
  {
    id: '3',
    type: 'update',
    title: 'NDRF Water Rescue Unit Deployed',
    message: '45 operators with motorized Zodiac rafts dispatched to Kalamassery sector.',
    time: '42 mins ago',
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'Satellite Telemetry Synced',
    message: 'ISRO and NASA Earth Observation feeds calibrated successfully.',
    time: '1 hour ago',
    read: true
  }
];

interface NavbarProps {
  onExitToLanding?: () => void;
  onCommandAction?: (actionId: string) => void;
}

export default function Navbar({ onExitToLanding, onCommandAction }: NavbarProps) {
  const { disasters } = useDisasterStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  
  // DEFCON state
  const [defconLevel, setDefconLevel] = useState<1 | 2 | 3 | 5>(2);
  const [showDefconMenu, setShowDefconMenu] = useState(false);

  // Operator clearance role
  const [currentRole, setCurrentRole] = useState<'admin' | 'responder' | 'citizen'>('admin');

  const ROLE_CONFIGS = {
    admin: {
      title: "EOC Admin",
      name: "Commander Ops",
      clearance: "CLEARANCE: LEVEL 5 (ALL-ACCESS)",
      badgeColor: "bg-emerald-600 text-white",
      statusColor: "text-emerald-400"
    },
    responder: {
      title: "Field Lead",
      name: "Tactical Unit Alpha",
      clearance: "CLEARANCE: LEVEL 3 (FIRST RESPONDER)",
      badgeColor: "bg-amber-600 text-white",
      statusColor: "text-amber-400"
    },
    citizen: {
      title: "Civilian",
      name: "Public Portal",
      clearance: "CLEARANCE: LEVEL 1 (COMMUNITY MONITOR)",
      badgeColor: "bg-zinc-700 text-white",
      statusColor: "text-zinc-300"
    }
  };
  
  // Settings states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeCritical = disasters.filter(d => d.severity >= 4).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const closeAllPanels = () => {
    setShowNotifications(false);
    setShowSettings(false);
    setShowHelp(false);
    setShowProfile(false);
    setShowDefconMenu(false);
  };

  const getDefconStyle = (lvl: number) => {
    switch (lvl) {
      case 1: return { label: 'DEFCON 1 CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
      case 2: return { label: 'DEFCON 2 ACTIVE', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 3: return { label: 'DEFCON 3 ELEVATED', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      default: return { label: 'DEFCON 5 MONITOR', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    }
  };

  const defcon = getDefconStyle(defconLevel);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand & Mission Readiness Indicator */}
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Shield className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold tracking-tight text-white">
                    DISASTER<span className="text-emerald-400">HUB</span>
                  </span>

                  {/* Interactive DEFCON Level Selector */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        const s = !showDefconMenu;
                        closeAllPanels();
                        setShowDefconMenu(s);
                      }}
                      className={`hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all cursor-pointer ${defcon.color}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
                      <span>{defcon.label}</span>
                      <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                    </button>

                    {showDefconMenu && (
                      <div className="absolute left-0 mt-2 w-48 glass-panel rounded-xl p-1.5 text-xs font-mono space-y-1 shadow-2xl z-50">
                        <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-zinc-500 border-b border-white/[0.06]">
                          Crisis Readiness Level
                        </div>
                        {[
                          { lvl: 1, title: 'DEFCON 1 (CRITICAL RED)', desc: 'Full Catastrophe' },
                          { lvl: 2, title: 'DEFCON 2 (HIGH SECTOR)', desc: 'Storm & Flood' },
                          { lvl: 3, title: 'DEFCON 3 (ELEVATED)', desc: 'Regional Watch' },
                          { lvl: 5, title: 'DEFCON 5 (PEACETIME)', desc: 'Standard Telemetry' }
                        ].map(item => (
                          <button
                            key={item.lvl}
                            onClick={() => {
                              setDefconLevel(item.lvl as any);
                              setShowDefconMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg transition-all ${
                              defconLevel === item.lvl
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                          >
                            <p className="text-[10px] font-bold">{item.title}</p>
                            <p className="text-[9px] text-zinc-500">{item.desc}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="hidden md:block text-[10px] text-zinc-400 font-mono tracking-wider">
                  AUTONOMOUS EMERGENCY OPERATIONS CENTER
                </p>
              </div>

              {onExitToLanding && (
                <button
                  onClick={onExitToLanding}
                  title="Return to Public Overview Portal"
                  className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-btn text-xs text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer ml-2"
                >
                  <Home className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">Portal Home</span>
                </button>
              )}
            </div>

            {/* Center Live Telemetry Clock & Command Palette Button */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => setShowCommandPalette(true)}
                className="glass-btn px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white flex items-center space-x-2 cursor-pointer shadow-sm group hover:border-emerald-500/40"
              >
                <Command className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
                <span>Quick Actions</span>
                <span className="px-1.5 py-0.2 rounded bg-white/[0.08] text-[9px] text-zinc-400">Cmd+K</span>
              </button>

              <div className="flex items-center space-x-3 bg-white/[0.03] px-3.5 py-1.5 rounded-xl border border-white/[0.08] text-xs font-mono text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>UTC {currentTime.toUTCString().slice(17, 25)}</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">CRITICAL ALERTS:</span>
                <span className={`font-bold ${activeCritical > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {activeCritical}
                </span>
              </div>
            </div>

            {/* Right Header Navigation Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* AI Assistant Chat Trigger */}
              <div className="relative">
                <button 
                  onClick={() => {
                    closeAllPanels();
                    setShowChat(!showChat);
                  }}
                  className={`p-2 rounded-xl transition-all relative flex items-center space-x-1.5 border cursor-pointer ${
                    showChat 
                      ? 'glass-btn-primary text-white shadow-lg' 
                      : 'glass-btn text-zinc-300 hover:text-white'
                  }`}
                  title="Gemini AI Tactical Copilot"
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-xs font-medium font-mono">AI Copilot</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#030712] animate-pulse"></span>
                </button>
                {showChat && (
                  <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] z-50">
                    <AIChat onClose={() => setShowChat(false)} />
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const s = !showNotifications;
                    closeAllPanels();
                    setShowNotifications(s);
                  }}
                  className={`p-2 rounded-xl transition-all relative border cursor-pointer ${
                    showNotifications 
                      ? 'bg-zinc-800 border-zinc-600 text-white' 
                      : 'glass-btn text-zinc-300 hover:text-white'
                  }`}
                  title="Active Telemetry Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-[#030712]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">Emergency Feed</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/20 text-red-300 font-semibold">
                          {unreadCount} Unread
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Clear All</span>
                        </button>
                      )}
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {notifications.map(item => (
                        <div 
                          key={item.id}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            item.read 
                              ? 'bg-white/[0.02] border-white/[0.05] opacity-75' 
                              : 'bg-white/[0.05] border-white/[0.1] shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-white">{item.title}</span>
                            <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const s = !showSettings;
                    closeAllPanels();
                    setShowSettings(s);
                  }}
                  className={`p-2 rounded-xl transition-all border cursor-pointer ${
                    showSettings 
                      ? 'bg-zinc-800 border-zinc-600 text-white' 
                      : 'glass-btn text-zinc-300 hover:text-white'
                  }`}
                  title="System Console Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                    <h4 className="font-bold text-sm text-white mb-3 pb-2 border-b border-white/[0.08] flex items-center space-x-1.5">
                      <Settings className="w-4 h-4 text-emerald-400" />
                      <span>Console Preferences</span>
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-1">
                        <div>
                          <p className="font-semibold text-white text-[11px]">Audio Siren Alerts</p>
                          <p className="text-[10px] text-zinc-400">Play acoustic alert on priority events</p>
                        </div>
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`p-1.5 rounded-lg border ${soundEnabled ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}
                        >
                          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div>
                          <p className="font-semibold text-white text-[11px]">Realtime Telemetry Sync</p>
                          <p className="text-[10px] text-zinc-400">WebSocket PostGIS delta refresh</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={autoRefresh}
                          onChange={() => setAutoRefresh(!autoRefresh)}
                          className="rounded bg-zinc-900 border-zinc-700 text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div>
                          <p className="font-semibold text-white text-[11px]">High-Contrast HUD</p>
                          <p className="text-[10px] text-zinc-400">Maximize tactical brightness</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={highContrast}
                          onChange={() => setHighContrast(!highContrast)}
                          className="rounded bg-zinc-900 border-zinc-700 text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help / Guide Trigger */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const s = !showHelp;
                    closeAllPanels();
                    setShowHelp(s);
                  }}
                  className={`p-2 rounded-xl transition-all border cursor-pointer ${
                    showHelp 
                      ? 'bg-zinc-800 border-zinc-600 text-white' 
                      : 'glass-btn text-zinc-300 hover:text-white'
                  }`}
                  title="Operations Guide & Protocols"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                {showHelp && (
                  <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                    <h4 className="font-bold text-sm text-white mb-2 pb-2 border-b border-white/[0.08] flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-400" />
                      <span>Crisis Protocols</span>
                    </h4>
                    <div className="space-y-2 text-zinc-300">
                      <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.06]">
                        <p className="font-semibold text-white text-[11px]">Level 5 - Catastrophe</p>
                        <p className="text-[10px] text-zinc-400">Immediate evacuation order required. Divert all regional medical stockpiles.</p>
                      </div>
                      <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.06]">
                        <p className="font-semibold text-white text-[11px]">Gemini AI Copilot</p>
                        <p className="text-[10px] text-zinc-400">Click AI Copilot or select a disaster to auto-generate triage reports & logistics needs.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-white/[0.08]"></div>

              {/* Operator Profile & Role Switcher */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const s = !showProfile;
                    closeAllPanels();
                    setShowProfile(s);
                  }}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl glass-btn text-xs cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-lg ${ROLE_CONFIGS[currentRole].badgeColor} flex items-center justify-center font-bold text-xs shadow-sm`}>
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline font-medium font-mono text-zinc-200">
                    {ROLE_CONFIGS[currentRole].title}
                  </span>
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl z-50 p-4 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center space-x-3 pb-3 border-b border-white/[0.08]">
                      <div className={`w-10 h-10 rounded-xl ${ROLE_CONFIGS[currentRole].badgeColor} flex items-center justify-center font-bold text-base shadow-md`}>
                        {ROLE_CONFIGS[currentRole].title[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white">{ROLE_CONFIGS[currentRole].name}</p>
                        <p className={`text-[10px] font-mono ${ROLE_CONFIGS[currentRole].statusColor}`}>
                          {ROLE_CONFIGS[currentRole].clearance}
                        </p>
                      </div>
                    </div>

                    {/* Switch Active Operational Role */}
                    <div className="py-2.5 space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                        Switch Operational Clearance:
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-[#02050e] p-1 rounded-xl border border-white/[0.08]">
                        {(['admin', 'responder', 'citizen'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => setCurrentRole(role)}
                            className={`py-1.5 px-2 rounded-lg text-center font-medium font-mono text-[10px] transition-all cursor-pointer ${
                              currentRole === role
                                ? 'bg-emerald-600 text-white font-bold shadow'
                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                          >
                            {ROLE_CONFIGS[role].title.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="py-1 space-y-1 text-zinc-300">
                      <div className="p-2 bg-white/[0.02] rounded-lg flex justify-between items-center text-[11px] font-mono">
                        <span className="text-zinc-400">Terminal Link:</span>
                        <span className="text-emerald-400 font-semibold">ENCRYPTED • LIVE</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.08]">
                      <button 
                        onClick={() => setShowProfile(false)}
                        className="w-full py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-center text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Close Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectAction={(actionId) => {
          onCommandAction?.(actionId);
        }}
      />
    </>
  );
}
