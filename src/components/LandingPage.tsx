import { 
  Shield, 
  Globe2, 
  MapPin, 
  ArrowRight, 
  Activity, 
  Radio, 
  Sparkles, 
  Cpu, 
  Database as DbIcon, 
  Zap, 
  Users, 
  Terminal, 
  ChevronRight,
  ShieldCheck,
  Radar,
  Waves,
  Flame,
  Wind
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: (initialView?: string) => void;
}

export default function LandingPage({ onLaunchDashboard }: LandingPageProps) {

  const LIVE_INCIDENTS = [
    {
      type: 'flood',
      icon: Waves,
      title: 'Kerala Flash Floods',
      sector: 'Kochi Tidal Basin',
      severity: 4,
      affected: '150,000 citizens',
      status: 'CRITICAL',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40'
    },
    {
      type: 'cyclone',
      icon: Wind,
      title: 'Severe Cyclonic Storm',
      sector: 'Chennai Coastline',
      severity: 5,
      affected: '500,000 citizens',
      status: 'MANDATORY EVAC',
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/40'
    },
    {
      type: 'earthquake',
      icon: Activity,
      title: 'Kutch Fault Rupture',
      sector: 'Bhuj, Gujarat',
      severity: 3,
      affected: '75,000 citizens',
      status: 'MONITORING',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
    },
    {
      type: 'wildfire',
      icon: Flame,
      title: 'Himalayan Ridge Fire',
      sector: 'Garhwal, Uttarakhand',
      severity: 4,
      affected: '25,000 citizens',
      status: 'ACTIVE SPREAD',
      color: 'text-orange-400 border-orange-500/30 bg-orange-950/40'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden">
      
      {/* Background Grid & Ambient Vignettes */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-60 z-0"></div>
      <div className="fixed inset-0 ambient-glow-emerald pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#050811]/70 to-[#050811] pointer-events-none z-0"></div>

      {/* Floating Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050811]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Shield className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm tracking-wider text-white">DISASTERHUB</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  v2.4 PRO
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500">Autonomous Crisis Operations</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs font-medium text-zinc-400">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-colors">
              Capabilities
            </a>
            <a href="#bento" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-colors">
              Architecture
            </a>
            <a href="#live-feed" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-colors">
              Live Incidents
            </a>
            <a href="#pipeline" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.05] transition-colors">
              Pipeline
            </a>
          </nav>

          {/* Right Action: Launch Dashboard */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DEFCON 2 STANDBY</span>
            </div>

            <button
              onClick={() => onLaunchDashboard()}
              className="glass-btn-primary px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-2 text-white group cursor-pointer shadow-lg"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        
        {/* Eyebrow Notification Badge */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-zinc-300 mb-8 backdrop-blur-md shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-400">Autonomous Emergency Ops 2.0</span>
          <span className="text-zinc-600">/</span>
          <span className="text-emerald-400 font-semibold">Gemini 1.5 Telemetry Active</span>
        </div>

        {/* Dramatic Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Autonomous Crisis Telemetry &{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
            Rapid Tactical Allocation
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
          A planetary-scale Emergency Operations Center combining real-time PostGIS spatial intelligence, 
          3D WebGL holo-recon, and context-aware Gemini AI for mission-critical disaster response.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
          <button
            onClick={() => onLaunchDashboard('map')}
            className="w-full sm:w-auto glass-btn-primary px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center space-x-2.5 text-white shadow-xl cursor-pointer group"
          >
            <Radar className="w-4 h-4 text-emerald-300" />
            <span>Enter Emergency Operations Center</span>
            <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onLaunchDashboard('globe')}
            className="w-full sm:w-auto glass-btn px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 text-zinc-200 hover:text-white cursor-pointer"
          >
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span>Inspect 3D Planetary Recon</span>
          </button>
        </div>

        {/* High-Tech Metrics Bar (21st.dev Style Glass Strip) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            { label: 'Citizens Monitored', value: '750,000+', icon: Users, desc: 'Across active sectors' },
            { label: 'Event Sync Latency', value: '< 120 ms', icon: Zap, desc: 'Supabase WebSockets' },
            { label: 'PostGIS Spatial Query', value: '4326 SRS', icon: MapPin, desc: 'Polygon evacuation buffer' },
            { label: 'EOC Readiness', value: 'DEFCON 2', icon: ShieldCheck, desc: 'High alert mobilized' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i}
                className="glass-panel p-4 rounded-2xl text-left border border-white/[0.08] relative group hover:border-white/[0.18] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{stat.label}</span>
                  <Icon className="w-3.5 h-3.5 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mb-0.5">{stat.value}</div>
                <p className="text-[10px] text-zinc-500 font-mono">{stat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Bento Grid Showcase */}
      <section id="bento" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-emerald-400 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>INTELLIGENCE CAPABILITIES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Split-Second Humanitarian Decisions
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: 2D Tactical GIS (Span 2) */}
          <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] relative overflow-hidden group">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  MAPBOX GL v3 ENGINE
                </span>
                <h3 className="text-xl font-bold text-white mt-2.5">
                  Dynamic 2D Tactical GIS & Hazard Buffers
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mt-1">
                  Vector cartography supporting Cyber Dark, Orbital Recon, and Tactical Night with dynamic GeoJSON evacuation polygons.
                </p>
              </div>
              <button 
                onClick={() => onLaunchDashboard('map')}
                className="glass-btn p-2 rounded-xl text-zinc-300 hover:text-white"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Tactical UI Simulation */}
            <div className="h-48 sm:h-56 rounded-2xl bg-[#03060f] border border-white/[0.06] p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-emerald-400">VECTOR MESH: 4 ACTIVE SECTORS</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-zinc-400">LAT: 10.85°N</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-zinc-400">LNG: 76.27°E</span>
                </div>
              </div>

              {/* Geo Grid Lines */}
              <div className="absolute inset-0 bg-tech-grid opacity-30"></div>
              
              {/* Radar Target Simulation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-emerald-500/20 animate-ping opacity-25"></div>
                  <div className="w-28 h-28 rounded-full border border-dashed border-cyan-500/30"></div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400 text-white font-mono text-[10px] font-bold">
                    KOCHI
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between z-10 text-[10px] text-zinc-500 font-mono">
                <span>ZOOM: 7.5x</span>
                <span>ALPHA CORRIDOR OPEN</span>
              </div>
            </div>
          </div>

          {/* Card 2: 3D Planetary Holo-Globe (Span 1) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] relative overflow-hidden flex flex-col justify-between group">
            <div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                WEBGL HARDWARE ENGINE
              </span>
              <h3 className="text-xl font-bold text-white mt-2.5">
                3D Holo-Globe Recon
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Planetary crisis overview with instant orbital jump to affected sectors.
              </p>
            </div>

            {/* Mini Rotating Globe Simulation */}
            <div className="my-6 relative flex items-center justify-center h-36">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex items-center justify-center relative">
                <Globe2 className="w-16 h-16 text-cyan-400/80 animate-spin" style={{ animationDuration: '24s' }} />
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <div className="absolute bottom-6 left-5 w-2 h-2 rounded-full bg-amber-400"></div>
              </div>
            </div>

            <button
              onClick={() => onLaunchDashboard('globe')}
              className="glass-btn w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center space-x-1.5"
            >
              <span>Launch 3D Globe</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Card 3: Gemini 1.5 SitRep AI (Span 1) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  GEMINI 1.5 FLASH
                </span>
                <span className="text-[10px] font-mono text-zinc-500">LIVE COGNITION</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2.5">
                Context-Aware Neural SitRep
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Zero-shot tactical analysis across disasters, medical beds, and water supply reserves.
              </p>
            </div>

            {/* Terminal snippet */}
            <div className="my-4 p-3 rounded-xl bg-[#03060f] border border-white/[0.06] font-mono text-[10px] text-zinc-400 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <Terminal className="w-3 h-3" />
                <span>COPILOT EVALUATION</span>
              </div>
              <p className="text-zinc-300">
                "Kerala Sector 4 has 45 water-rescue operators deployed. Medical supply deficit: 350 trauma packs."
              </p>
            </div>

            <button
              onClick={() => onLaunchDashboard('ai-analysis')}
              className="glass-btn w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center space-x-1.5"
            >
              <span>Open AI Copilot</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Card 4: Multi-Channel Siren Broadcast (Span 2) */}
          <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-red-500/10 text-red-300 border border-red-500/20">
                  COMMON ALERTING PROTOCOL (CAP)
                </span>
                <h3 className="text-xl font-bold text-white mt-2.5">
                  Emergency Siren & Civic Broadcast Hub
                </h3>
                <p className="text-xs text-zinc-400 max-w-lg mt-1">
                  Synchronized siren trigger, cellular broadcast push, and social feed dissemination with geographic perimeter targeting.
                </p>
              </div>
            </div>

            {/* Distribution channels pill list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center space-x-2 text-red-400 text-xs font-semibold mb-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Physical Sirens</span>
                </div>
                <p className="text-[10px] text-zinc-400">Outdoor warning arrays in coastal sectors</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Cellular CAP</span>
                </div>
                <p className="text-[10px] text-zinc-400">High-priority SMS & mobile network push</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold mb-1">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Public Web Feeds</span>
                </div>
                <p className="text-[10px] text-zinc-400">Instant RSS, media, & portal sync</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Live Tracked Incidents Strip */}
      <section id="live-feed" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE SECTOR SURVEILLANCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Active Catastrophes Under Telemetry
            </h2>
          </div>
          <button
            onClick={() => onLaunchDashboard('map')}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>View Full GIS Terminal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {LIVE_INCIDENTS.map((inc, i) => {
            const Icon = inc.icon;
            return (
              <div 
                key={i} 
                className="glass-panel p-4 rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-white/[0.04] text-white">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${inc.color}`}>
                      {inc.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{inc.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-mono flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{inc.sector}</span>
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Pop: {inc.affected}</span>
                  <span className="font-bold text-white">Severity {inc.severity}/5</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Execution Pipeline */}
      <section id="pipeline" className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">
            SYSTEM PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            From Detection to Evacuation in Milliseconds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Multi-Modal Telemetry Ingestion',
              desc: 'High-frequency weather sensors, seismic gauges, and satellite imagery stream directly into PostGIS spatial layers.',
              icon: DbIcon
            },
            {
              step: '02',
              title: 'Gemini 1.5 Neural Triaging',
              desc: 'AI models analyze population density, flood depths, and road washouts to forecast trauma kit and bed requisitions.',
              icon: Sparkles
            },
            {
              step: '03',
              title: 'Tactical Deployment & Siren Broadcast',
              desc: 'Automated sirens trigger, response teams mobilize, and evacuation corridors are broadcast over CAP cellular feeds.',
              icon: ShieldCheck
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i} 
                className="glass-panel p-6 rounded-3xl border border-white/[0.08] relative"
              >
                <div className="text-3xl font-black font-mono text-white/[0.08] mb-4">
                  {item.step}
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Pre-Footer Call to Action */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Mobilize Real-Time Emergency Operations
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8">
              Access the live tactical GIS canvas, 3D Holo-Globe, Gemini AI copilot, and supply stockpile controls right now.
            </p>
            <button
              onClick={() => onLaunchDashboard()}
              className="glass-btn-primary px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase text-white shadow-2xl cursor-pointer"
            >
              Open EOC Command Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="relative z-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-400 font-bold">DISASTERHUB EOC</span>
          <span>&bull;</span>
          <span>Architected by <strong className="text-zinc-300">Parthsaarthie Sharma</strong></span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEMS NOMINAL</span>
          </span>
          <button 
            onClick={() => onLaunchDashboard()}
            className="hover:text-zinc-300 underline"
          >
            Launch Terminal
          </button>
        </div>
      </footer>

    </div>
  );
}
