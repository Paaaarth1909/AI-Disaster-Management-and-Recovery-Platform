import { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Box, 
  Bell, 
  Plus, 
  Bot, 
  Map as MapIcon, 
  Globe2, 
  BarChart3, 
  Brain, 
  Maximize2, 
  Minimize2, 
  Search, 
  Radio, 
  Flame, 
  Waves,
  Wind, 
  ChevronRight, 
  Sparkles,
  Activity
} from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import Map from './Map';
import Analytics from './Analytics';
import AIAnalysis from './AIAnalysis';
import ReportIncident from './ReportIncident';
import ResourceModal from './ResourceModal';
import AlertModal from './AlertModal';
import AIChat from './AIChat';
import { Globe } from './Globe';
import Dock from './Dock';
import { format } from 'date-fns';

export default function Dashboard() {
  const { 
    disasters, 
    resources, 
    teams, 
    alerts,
    loading,
    error,
    fetchInitialData,
    subscribeToUpdates,
    unsubscribeFromUpdates
  } = useDisasterStore();

  const [activeView, setActiveView] = useState('map');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);

  // Filters & layout state
  const [disasterSearch, setDisasterSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'moderate' | 'minor'>('all');
  const [isViewportExpanded, setIsViewportExpanded] = useState(false);

  useEffect(() => {
    fetchInitialData();
    subscribeToUpdates();
    return () => unsubscribeFromUpdates();
  }, []);

  const activeDisasters = disasters.filter(d => d.status === 'active');
  const criticalDisasters = disasters.filter(d => d.severity >= 4);
  const availableTeams = teams.filter(t => t.status === 'available');
  const deployedTeams = teams.filter(t => t.status === 'responding' || t.status === 'on-site');
  const totalSupplyCount = resources.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
  const deployedResources = resources.filter(r => r.status === 'deployed');

  const filteredDisasters = useMemo(() => {
    return disasters.filter(d => {
      const matchesSearch = 
        d.title.toLowerCase().includes(disasterSearch.toLowerCase()) ||
        d.location_name.toLowerCase().includes(disasterSearch.toLowerCase()) ||
        d.type.toLowerCase().includes(disasterSearch.toLowerCase());
      
      if (!matchesSearch) return false;
      if (severityFilter === 'critical') return d.severity >= 4;
      if (severityFilter === 'moderate') return d.severity === 3;
      if (severityFilter === 'minor') return d.severity <= 2;
      return true;
    });
  }, [disasters, disasterSearch, severityFilter]);

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'wildfire': return Flame;
      case 'flood':
      case 'tsunami': return Waves;
      case 'tornado':
      case 'hurricane': return Wind;
      default: return AlertTriangle;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'map':
        return <Map onDisasterSelect={setSelectedDisaster} selectedDisasterId={selectedDisaster} />;
      case 'globe':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-4">
            <Globe />
          </div>
        );
      case 'analytics':
        return (
          <div className="p-4 sm:p-6 overflow-y-auto h-full bg-slate-950/70">
            <Analytics />
          </div>
        );
      case 'ai-analysis':
        return (
          <div className="p-4 sm:p-6 overflow-y-auto h-full bg-slate-950/70">
            <AIAnalysis />
          </div>
        );
      default:
        return <Map onDisasterSelect={setSelectedDisaster} selectedDisasterId={selectedDisaster} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <Activity className="w-8 h-8 text-blue-400 absolute" />
        </div>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase animate-pulse">
          Initializing DisasterHub Telemetry...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/30 p-8 rounded-2xl text-center max-w-md shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">Telemetry Pipeline Error</h3>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => fetchInitialData()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/30"
          >
            Reconnect Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-16 pb-28 relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Background ambient light mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-6">
        
        {/* TOP COMMAND METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Active Disasters Card */}
          <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xl border border-slate-800 hover:border-red-500/40 rounded-2xl p-4 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Emergencies</span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white font-mono">{activeDisasters.length}</span>
              <span className="text-xs text-red-400 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1"></span>
                {criticalDisasters.length} Critical (Lv 4-5)
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/80">
              <span>{disasters.length} Recorded incidents</span>
              <span className="text-emerald-400 font-medium">All telemetry synced</span>
            </div>
          </div>

          {/* Tactical Response Teams Card */}
          <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Response Personnel</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white font-mono">{teams.length}</span>
              <span className="text-xs text-emerald-400 font-semibold">
                {deployedTeams.length} Deployed in Field
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/80">
              <span>{availableTeams.length} Units on standby</span>
              <span className="text-slate-300 font-mono">100% Rapid-Ready</span>
            </div>
          </div>

          {/* Supply Depot Stockpiles Card */}
          <div className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xl border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Relief Stockpiles</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Box className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {totalSupplyCount > 1000 ? `${(totalSupplyCount / 1000).toFixed(1)}k` : totalSupplyCount}
              </span>
              <span className="text-xs text-blue-400 font-semibold">
                {deployedResources.length} Batches Dispatched
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/80">
              <span>{resources.length} Depots monitored</span>
              <span className="text-emerald-400 font-medium">Supply lines clear</span>
            </div>
          </div>

          {/* AI Emergency Copilot Banner Card */}
          <button
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-br from-blue-900/50 via-indigo-900/40 to-slate-900/80 hover:from-blue-900/70 hover:to-slate-900 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400 rounded-2xl p-4 text-left transition-all duration-300 shadow-xl group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>Gemini Intelligence</span>
              </span>
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 group-hover:scale-110 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-white tracking-tight">AI Mission Copilot</span>
            </div>
            <p className="mt-1 text-xs text-blue-200/70 truncate">
              Ask questions, predict logistics, verify citizen rumors
            </p>
            <div className="mt-2.5 flex items-center text-[11px] text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Launch Copilot Terminal</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </button>

        </div>

        {/* MAIN VISUALIZATION STAGE (MAP / GLOBE / ANALYTICS / AI) */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* Top Control Bar inside Viewport */}
          <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
              {[
                { id: 'map', label: 'Tactical Map', icon: MapIcon },
                { id: 'globe', label: '3D Globe', icon: Globe2 },
                { id: 'analytics', label: 'Telemetry Trends', icon: BarChart3 },
                { id: 'ai-analysis', label: 'AI Diagnostics', icon: Brain }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Stage Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Report Incident</span>
              </button>

              <button
                onClick={() => setShowAlertModal(true)}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all active:scale-95"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Broadcast Siren</span>
              </button>

              <button
                onClick={() => setShowResourceModal(true)}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-medium border border-slate-700 transition-all active:scale-95"
              >
                <Box className="w-3.5 h-3.5 text-blue-400" />
                <span>Add Supply</span>
              </button>

              <button
                onClick={() => setIsViewportExpanded(!isViewportExpanded)}
                title={isViewportExpanded ? 'Collapse Stage' : 'Expand Stage'}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors"
              >
                {isViewportExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Viewport Canvas Container */}
          <div 
            className="w-full relative transition-all duration-300" 
            style={{ height: isViewportExpanded ? '780px' : '580px' }}
          >
            {renderContent()}
          </div>
        </div>

        {/* LOWER SPLIT GRID: INCIDENTS FEED + LOGISTICS / ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLS: ACTIVE INCIDENTS FEED */}
          <div className="lg:col-span-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>Real-time Incident Intelligence</span>
                </h3>
                <p className="text-xs text-slate-400">Live geo-referenced catastrophes requiring priority response</p>
              </div>

              {/* Severity Filter Pills */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['all', 'critical', 'moderate', 'minor'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                      severityFilter === sev
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev === 'all' ? 'All' : sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search within feed */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter incidents by title, sector name, or hazard type..."
                value={disasterSearch}
                onChange={(e) => setDisasterSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Incidents Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredDisasters.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
                  No active incidents match current search or severity filters.
                </div>
              ) : (
                filteredDisasters.map(disaster => {
                  const Icon = getDisasterIcon(disaster.type);
                  const isSelected = selectedDisaster === disaster.id;
                  const isCritical = disaster.severity >= 4;

                  return (
                    <div
                      key={disaster.id}
                      onClick={() => {
                        setSelectedDisaster(disaster.id);
                        if (activeView !== 'map') setActiveView('map');
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group ${
                        isSelected 
                          ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30 shadow-xl' 
                          : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Card Top: Severity Badge & Time */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 ${
                          isCritical
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : disaster.severity === 3
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          <Icon className="w-3 h-3 mr-1" />
                          <span>LVL {disaster.severity} &bull; {disaster.type}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {format(new Date(disaster.created_at), 'MMM d, HH:mm')}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors mb-1">
                        {disaster.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {disaster.description}
                      </p>

                      {/* Location & Casualty Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                        <span className="truncate max-w-[140px] text-slate-300">
                          📍 {disaster.location_name}
                        </span>
                        <span className="text-amber-400">
                          👥 {disaster.affected_population?.toLocaleString() || 'Unknown'}
                        </span>
                      </div>

                      {/* Card Action Shortcuts */}
                      <div className="mt-3 flex items-center space-x-1.5 pt-2 border-t border-slate-800/40">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDisaster(disaster.id);
                            setActiveView('map');
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-medium transition-colors text-center"
                        >
                          Focus Map
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDisaster(disaster.id);
                            setActiveView('ai-analysis');
                          }}
                          className="py-1 px-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[11px] font-medium transition-colors flex items-center space-x-1"
                        >
                          <Brain className="w-3 h-3" />
                          <span>AI Triage</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDisaster(disaster.id);
                            setShowAlertModal(true);
                          }}
                          className="py-1 px-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-[11px] font-medium transition-colors flex items-center space-x-1"
                        >
                          <Bell className="w-3 h-3" />
                          <span>Alert</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT 1 COL: LOGISTICS & LIVE SIRENS */}
          <div className="space-y-6">
            
            {/* Supplies Inventory */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-blue-400" />
                  <h4 className="font-bold text-sm text-white">Emergency Logistics</h4>
                </div>
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  + Add Stock
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {resources.map(res => (
                  <div key={res.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white">{res.name}</p>
                        <p className="text-[11px] text-slate-400">{res.location_name}</p>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        res.status === 'deployed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        res.status === 'in-transit' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                      <span>Reserve Count:</span>
                      <strong className="text-white">{res.quantity} {res.unit}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Warning Sirens Feed */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h4 className="font-bold text-sm text-white">Broadcast Sirens</h4>
                </div>
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  + Dispatch
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {alerts.slice(0, 5).map(alert => (
                  <div 
                    key={alert.id} 
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 border-l-4 border-l-amber-500 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 truncate max-w-[180px]">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {format(new Date(alert.sent_at || alert.created_at), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {alert.channels.map((ch, i) => (
                        <span key={i} className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 capitalize">
                          {ch.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modern Floating Dock at the bottom */}
      <Dock activeView={activeView} onViewChange={setActiveView} />

      {/* Modals */}
      {showReportModal && (
        <ReportIncident onClose={() => setShowReportModal(false)} />
      )}

      {showResourceModal && (
        <ResourceModal onClose={() => setShowResourceModal(false)} />
      )}

      {showAlertModal && (
        <AlertModal 
          onClose={() => setShowAlertModal(false)} 
          disasterId={selectedDisaster || undefined} 
        />
      )}

      {/* Floating AI Chat window */}
      {showChat && (
        <div className="fixed bottom-28 right-6 w-96 max-w-[calc(100vw-2rem)] z-50 shadow-2xl">
          <AIChat onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
}
