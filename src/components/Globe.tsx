import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import type { COBEOptions } from "cobe";
import { useDisasterStore } from '../store/disaster';
import { Globe2, Eye, RotateCw, Target } from 'lucide-react';

const defaultConfig: COBEOptions = {
  width: 1000,
  height: 1000,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.15, 0.2, 0.35],
  markerColor: [0.95, 0.35, 0.25],
  glowColor: [0.2, 0.45, 0.95],
  markers: [],
  opacity: 0.9,
};

export function Globe({
  className = "",
  config = defaultConfig,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const { disasters } = useDisasterStore();
  const phiRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert disasters to markers with proper scaling and colors
  const markers = disasters
    .filter(disaster => disaster.location?.coordinates)
    .map(disaster => ({
      location: [disaster.location.coordinates[1], disaster.location.coordinates[0]] as [number, number], // Swap lat/lng for COBE
      size: Math.max(0.6, Math.min(1.8, disaster.severity * 0.35)), // Scale marker size based on severity
      color: getDisasterColor(disaster.type, disaster.severity),
    }));

  function getDisasterColor(type: string, _severity: number): [number, number, number] {
    switch (type) {
      case 'earthquake':
        return [1, 0.3, 0.2]; // Red
      case 'flood':
        return [0.2, 0.5, 1]; // Blue
      case 'hurricane':
        return [0.9, 0.8, 0.2]; // Yellow
      case 'tornado':
        return [0.7, 0.2, 0.9]; // Purple
      case 'wildfire':
        return [1, 0.5, 0]; // Orange
      case 'tsunami':
        return [0, 0.8, 1]; // Cyan
      default:
        return [1, 1, 1]; // White
    }
  }

  const focusSector = (disaster: any) => {
    if (!disaster.location?.coordinates) return;
    setSelectedDisasterId(disaster.id);
    const lng = disaster.location.coordinates[0];
    // In COBE, target phi centers the given longitude
    const targetPhi = -(lng * Math.PI) / 180 + Math.PI / 2;
    phiRef.current = targetPhi;
    setRotation(0);
  };

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setRotation(delta / 200);
    }
  };

  const onResize = () => {
    // handled dynamically in render
  };

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) {
        phiRef.current += 0.004;
      }
      state.phi = phiRef.current + rotation;
      const currentWidth = (canvasRef.current?.offsetWidth || 650) * 2;
      state.width = currentWidth;
      state.height = currentWidth;
    },
    [rotation],
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    window.addEventListener("resize", onResize);

    const initialWidth = (canvasRef.current.offsetWidth || canvasRef.current.clientWidth || 650) * 2;

    const globeConfig = {
      ...defaultConfig,
      ...config,
      width: initialWidth,
      height: initialWidth,
      onRender,
      markers,
    };

    const globe = createGlobe(canvasRef.current, globeConfig);

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
        setIsLoading(false);
      }
    }, 300);

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [disasters]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#030712] font-sans ${className}`}>
      {/* Top Telemetry Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 glass-panel px-3.5 py-1.5 rounded-xl border border-white/[0.12] text-xs text-zinc-300 shadow-xl">
        <Globe2 className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
        <span className="font-mono text-emerald-400 font-semibold tracking-wider">HOLO-GLOBE RECON</span>
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-400">{markers.length} Active Targets Projected</span>
      </div>

      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center space-x-2 glass-panel px-3.5 py-1.5 rounded-xl border border-white/[0.12] text-xs text-zinc-400 shadow-xl">
        <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-mono">Click & Drag to Rotate</span>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030712]/80 backdrop-blur-sm z-30">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-emerald-500/20 border-t-emerald-500"></div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-0 transition-opacity duration-500 max-w-[800px] max-h-[800px]"
        style={{ 
          contain: "layout paint size",
          cursor: "grab"
        }}
        onPointerDown={(e) =>
          updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-panel border border-white/[0.12] rounded-2xl p-3.5 shadow-xl text-xs text-white z-20">
        <div className="flex items-center space-x-1.5 mb-2 font-semibold text-zinc-300">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Global Hazard Key</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-zinc-300">
          {['earthquake', 'flood', 'hurricane', 'tornado', 'wildfire', 'tsunami'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <div 
                className="w-2.5 h-2.5 rounded-full shadow-sm" 
                style={{ 
                  backgroundColor: `rgb(${getDisasterColor(type, 5).map(c => c * 255).join(',')})` 
                }}
              />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Sector Jump Panel */}
      <div className="absolute bottom-4 right-4 glass-panel border border-white/[0.12] rounded-2xl p-3 shadow-xl text-xs text-white z-20 max-w-xs hidden sm:block">
        <div className="flex items-center space-x-1.5 mb-2 font-semibold text-zinc-300">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>Orbital Jump To Sector</span>
        </div>
        <div className="space-y-1.5">
          {disasters.slice(0, 4).map(d => (
            <button
              key={d.id}
              onClick={() => focusSector(d)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-left transition-all ${
                selectedDisasterId === d.id
                  ? 'bg-emerald-500 border-emerald-400 text-[#030712] font-bold shadow-lg shadow-emerald-500/30'
                  : 'bg-[#030712]/60 border-white/[0.08] hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <div className="truncate pr-2">
                <p className="font-semibold text-[11px] truncate">{d.title}</p>
                <p className="text-[9px] text-slate-400 font-mono truncate">{d.location_name}</p>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                d.severity >= 4 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                Lv {d.severity}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
