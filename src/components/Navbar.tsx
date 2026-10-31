import { useState, useEffect } from 'react';
import { 
  Activity, 
  Settings, 
  Bell, 
  HelpCircle, 
  User, 
  LogOut, 
  Mail, 
  AlertTriangle, 
  Bot, 
  Radio, 
  Clock, 
  CheckCheck,
  Volume2,
  VolumeX,
  Flame,
  Info
} from 'lucide-react';
import AIChat from './AIChat';
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
    time: '14 mins ago',
    read: false
  },
  {
    id: '3',
    type: 'update',
    title: 'Medical Deployment Confirmed',
    message: 'Tamil Nadu Medical Corps en route to Sector 4 with 50 emergency trauma beds.',
    time: '32 mins ago',
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

export default function Navbar() {
  const { disasters } = useDisasterStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentRole, setCurrentRole] = useState<'admin' | 'responder' | 'citizen'>('admin');

  const ROLE_CONFIGS = {
    admin: {
      title: "EOC Admin",
      name: "Commander Ops",
      clearance: "LEVEL 5 (ALL-ACCESS)",
      badgeColor: "bg-blue-600 text-white",
      statusColor: "text-emerald-400"
    },
    responder: {
      title: "Field Lead",
      name: "Tactical Unit Alpha",
      clearance: "LEVEL 3 (FIRST RESPONDER)",
      badgeColor: "bg-emerald-600 text-white",
      statusColor: "text-amber-400"
    },
    citizen: {
      title: "Civilian",
      name: "Public Portal",
      clearance: "LEVEL 1 (COMMUNITY MONITOR)",
      badgeColor: "bg-purple-600 text-white",
      statusColor: "text-blue-400"
    }
  };
  const [showChat, setShowChat] = useState(false);
  
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
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Mission Readiness Indicator */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  DISASTER<span className="text-blue-400">HUB</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
                  DEFCON 2 ACTIVE
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-400 font-mono tracking-wider">
                AI DISASTER MANAGEMENT & EMERGENCY OPERATIONS CENTER
              </p>
            </div>
          </div>

          {/* Center Live Telemetry Clock */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>UTC {currentTime.toUTCString().slice(17, 25)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">CRITICAL ALERTS:</span>
            <span className={`font-bold ${activeCritical > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {activeCritical}
            </span>
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
                className={`p-2 rounded-xl transition-all relative flex items-center space-x-1.5 border ${
                  showChat 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Gemini AI Tactical Copilot"
              >
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline text-xs font-medium">AI Copilot</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-950"></span>
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
                className={`p-2 rounded-xl transition-all relative border ${
                  showNotifications 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Incident Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] bg-red-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border border-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Radio className="w-4 h-4 text-red-400" />
                      <h4 className="text-sm font-bold text-white tracking-wide">Emergency Feeds</h4>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {notifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1">
                    {notifications.map(n => (
                      <div 
                        key={n.id}
                        className={`p-3 rounded-xl transition-colors flex items-start space-x-3 ${
                          n.read ? 'hover:bg-slate-800/40 text-slate-400' : 'bg-slate-800/30 hover:bg-slate-800/60 text-slate-200'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                          n.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                          n.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {n.type === 'alert' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                           n.type === 'update' ? <Mail className="w-3.5 h-3.5" /> :
                           <Info className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                            <span className="text-[10px] font-mono text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-800 bg-slate-950/50 text-center">
                    <span className="text-[11px] text-slate-400">
                      Live alerts connected to Supabase Realtime channel
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  const s = !showSettings;
                  closeAllPanels();
                  setShowSettings(s);
                }}
                className={`p-2 rounded-xl transition-all border ${
                  showSettings 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="System Preferences"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <h4 className="font-bold text-sm text-white mb-3 flex items-center space-x-1.5 pb-2 border-b border-slate-800">
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span>Station Preferences</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-300">
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                        <span>Audio Siren Alert</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={() => setSoundEnabled(!soundEnabled)}
                        className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span>Telemetry Auto-Sync</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={() => setAutoRefresh(!autoRefresh)}
                        className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Hazard High-Contrast</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={highContrast}
                        onChange={() => setHighContrast(!highContrast)}
                        className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                      BUILD v2.5.0-TACTICAL &bull; NODE ACTIVE
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
                className={`p-2 rounded-xl transition-all border ${
                  showHelp 
                    ? 'bg-slate-800 border-slate-600 text-white' 
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Operations Guide & Protocols"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {showHelp && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <h4 className="font-bold text-sm text-white mb-2 pb-2 border-b border-slate-800 flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>Disaster Protocols</span>
                  </h4>
                  <div className="space-y-2 text-slate-300">
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                      <p className="font-semibold text-white text-[11px]">Level 5 - Catastrophe</p>
                      <p className="text-[10px] text-slate-400">Immediate evacuation order required. Divert all regional medical stockpiles.</p>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                      <p className="font-semibold text-white text-[11px]">Gemini AI Copilot</p>
                      <p className="text-[10px] text-slate-400">Click AI Copilot or select a disaster to auto-generate triage reports & logistics needs.</p>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                      <p className="font-semibold text-white text-[11px]">Emergency Hotline</p>
                      <p className="text-[10px] text-emerald-400 font-mono">NDRF: 1078 &bull; POLICE: 112</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-slate-800"></div>

            {/* Operator Profile & Role Switcher */}
            <div className="relative">
              <button 
                onClick={() => {
                  const s = !showProfile;
                  closeAllPanels();
                  setShowProfile(s);
                }}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-xs"
              >
                <div className={`w-6 h-6 rounded-lg ${ROLE_CONFIGS[currentRole].badgeColor} flex items-center justify-center font-bold text-xs shadow-sm`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline font-medium text-slate-200">
                  {ROLE_CONFIGS[currentRole].title}
                </span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl z-50 p-4 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
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
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Switch Role Mode:
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {(['admin', 'responder', 'citizen'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => setCurrentRole(role)}
                          className={`py-1.5 px-2 rounded-lg text-center font-medium text-[10px] transition-all ${
                            currentRole === role
                              ? 'bg-blue-600 text-white font-bold shadow'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {ROLE_CONFIGS[role].title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-1 space-y-1 text-slate-300">
                    <div className="p-2 bg-slate-950/50 rounded-lg flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Terminal Link:</span>
                      <span className="text-emerald-400 font-semibold font-mono">ENCRYPTED &bull; LIVE</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button 
                      onClick={() => setShowProfile(false)}
                      className="w-full py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-center text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
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
  );
}
