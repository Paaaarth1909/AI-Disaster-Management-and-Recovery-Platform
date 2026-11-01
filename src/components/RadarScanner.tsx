import { Radar, Crosshair } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';

export default function RadarScanner() {
  const { disasters } = useDisasterStore();

  const activeHazards = disasters.slice(0, 4);

  return (
    <div className="glass-panel rounded-2xl border border-white/[0.08] p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 z-10 relative">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radar className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono tracking-wider text-white">TACTICAL RADAR SCANNER</h4>
            <p className="text-[9px] font-mono text-zinc-500">Doppler Sweep • 9.41 GHz Active</p>
          </div>
        </div>
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>ONLINE</span>
        </span>
      </div>

      {/* Center Radar Scope */}
      <div className="relative w-full aspect-square max-w-[220px] mx-auto my-2 flex items-center justify-center">
        
        {/* Concentric Range Rings */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/20"></div>
        <div className="absolute inset-6 rounded-full border border-emerald-500/15 border-dashed"></div>
        <div className="absolute inset-12 rounded-full border border-emerald-500/20"></div>
        <div className="absolute inset-20 rounded-full border border-emerald-500/25"></div>

        {/* Crosshair Axes */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-emerald-500/20"></div>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-emerald-500/20"></div>

        {/* Rotating Radar Sweep Cone */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div 
            className="w-full h-full animate-radar"
            style={{
              background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.35) 0deg, transparent 60deg, transparent 360deg)'
            }}
          ></div>
        </div>

        {/* Center Radar Node */}
        <div className="relative w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_12px_#10b981] z-10"></div>

        {/* Dynamic Blinking Hazard Blips */}
        {activeHazards.map((d, idx) => {
          // Pre-calculated radial offsets for tactical realism
          const positions = [
            { top: '24%', left: '72%' },
            { top: '68%', left: '28%' },
            { top: '35%', left: '32%' },
            { top: '78%', left: '65%' },
          ];
          const pos = positions[idx % positions.length];
          const isCritical = d.severity >= 4;

          return (
            <div 
              key={d.id} 
              className="absolute z-20 group/blip cursor-pointer"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-3.5 h-3.5 rounded-full animate-ping opacity-75 ${
                  isCritical ? 'bg-red-500' : 'bg-amber-400'
                }`}></span>
                <span className={`relative w-2 h-2 rounded-full border border-white ${
                  isCritical ? 'bg-red-500' : 'bg-amber-400'
                }`}></span>
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/blip:block bg-[#02050e] border border-white/20 text-[9px] font-mono text-white px-2 py-1 rounded shadow-xl whitespace-nowrap z-30">
                <p className="font-bold">{d.title}</p>
                <p className="text-zinc-400">Severity {d.severity}/5</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry Stamp */}
      <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span className="flex items-center space-x-1">
          <Crosshair className="w-3 h-3 text-emerald-400" />
          <span>RADIAL RANGE: 100 KM</span>
        </span>
        <span className="text-emerald-400 font-bold">{disasters.length} TARGETS</span>
      </div>

    </div>
  );
}
