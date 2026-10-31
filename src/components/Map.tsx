import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import Map, { 
  Marker, 
  Popup, 
  Source, 
  Layer,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  MapRef,
  ViewStateChangeEvent
} from 'react-map-gl';
import { 
  AlertTriangle, 
  Users, 
  Box, 
  Truck, 
  Shield, 
  Wind, 
  Layers, 
  Eye, 
  EyeOff, 
  Crosshair, 
  Maximize2, 
  Compass, 
  Satellite, 
  Moon, 
  Flame,
  Waves,
  ChevronRight,
  Key
} from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';
import 'mapbox-gl/dist/mapbox-gl.css';

type Disaster = Database['public']['Tables']['disasters']['Row'];
type Resource = Database['public']['Tables']['resources']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];

// Ensure global token is set
const ENV_MAPBOX_TOKEN = (import.meta.env.VITE_MAPBOX_TOKEN || '').trim();
if (typeof window !== 'undefined' && ENV_MAPBOX_TOKEN) {
  mapboxgl.accessToken = ENV_MAPBOX_TOKEN;
}

// Resilient Fallback Raster Styles (used if no token or offline)
const FALLBACK_CARTO_DARK = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

const FALLBACK_ESRI_SATELLITE = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri'
    }
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const FALLBACK_CARTO_VOYAGER = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

const BASEMAP_METADATA = {
  dark: {
    id: 'dark',
    name: 'Cyber Dark',
    icon: Moon,
    description: 'High-contrast nocturnal tactical feed'
  },
  satellite: {
    id: 'satellite',
    name: 'Orbital Recon',
    icon: Satellite,
    description: 'High-resolution satellite imagery'
  },
  tactical: {
    id: 'tactical',
    name: 'Tactical Night',
    icon: Compass,
    description: 'Emergency route navigation & infra'
  },
  streets: {
    id: 'streets',
    name: 'Grid Streets',
    icon: Shield,
    description: 'Standard cartography & street network'
  }
};

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  medical: Shield,
  food: Box,
  water: Wind,
  shelter: Box,
  rescue: Users,
  transport: Truck
};

// GeoJSON hazard zones
const sampleEvacuationZones = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { zone: 'Alpha Zone - Kochi Corridor', risk: 'high', population: 45000 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.15, 10.75],
          [76.45, 10.75],
          [76.45, 11.05],
          [76.15, 11.05],
          [76.15, 10.75]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { zone: 'Bravo Zone - Chennai Coastal Sector', risk: 'high', population: 120000 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.15, 12.95],
          [80.45, 12.95],
          [80.45, 13.25],
          [80.15, 13.25],
          [80.15, 12.95]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { zone: 'Delta Buffer - Gujarat Basin', risk: 'medium', population: 30000 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [70.05, 23.10],
          [70.40, 23.10],
          [70.40, 23.40],
          [70.05, 23.40],
          [70.05, 23.10]
        ]]
      }
    }
  ]
};

const sampleFloodedAreas = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { depth: 'severe', waterLevelM: 2.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.22, 10.82],
          [76.38, 10.82],
          [76.38, 10.98],
          [76.22, 10.98],
          [76.22, 10.82]
        ]]
      }
    }
  ]
};

const sampleRescueRoutes = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { code: 'PRIMARY-CORRIDOR-01', status: 'clear' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.24, 10.80],
          [76.28, 10.84],
          [76.31, 10.88],
          [76.35, 10.92]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { code: 'COASTAL-EXTRACTION-02', status: 'active' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [80.20, 13.00],
          [80.25, 13.05],
          [80.28, 13.12],
          [80.32, 13.18]
        ]
      }
    }
  ]
};

interface DisasterMapProps {
  onDisasterSelect?: (id: string) => void;
  selectedDisasterId?: string | null;
}

export default function DisasterMap({ onDisasterSelect, selectedDisasterId }: DisasterMapProps) {
  const { disasters, teams, resources } = useDisasterStore();
  const [popupInfo, setPopupInfo] = useState<Disaster | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const mapRef = useRef<MapRef>(null);

  // Map layer toggles
  const [activeBasemap, setActiveBasemap] = useState<'dark' | 'satellite' | 'tactical' | 'streets'>('dark');
  const [activeToken, setActiveToken] = useState<string>(ENV_MAPBOX_TOKEN);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showTokenSettings, setShowTokenSettings] = useState<boolean>(false);
  const hasToken = Boolean(activeToken && activeToken.startsWith('pk.'));

  const [showEvacZones, setShowEvacZones] = useState(true);
  const [showFloodHazard, setShowFloodHazard] = useState(true);
  const [showRescueRoutes, setShowRescueRoutes] = useState(true);
  const [showDisasters, setShowDisasters] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showTeams, setShowTeams] = useState(true);

  // Control drawer / overlays
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);
  const [, setIsMapLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4.2,
    bearing: 0,
    pitch: 35
  });

  const getMapStyle = (styleId: 'dark' | 'satellite' | 'tactical' | 'streets') => {
    if (hasToken) {
      switch (styleId) {
        case 'dark': return 'mapbox://styles/mapbox/dark-v11';
        case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12';
        case 'tactical': return 'mapbox://styles/mapbox/navigation-night-v1';
        case 'streets': return 'mapbox://styles/mapbox/streets-v12';
      }
    }
    // High-res fallback raster tiles if no Mapbox token is present
    switch (styleId) {
      case 'dark': return FALLBACK_CARTO_DARK;
      case 'satellite': return FALLBACK_ESRI_SATELLITE;
      case 'streets':
      case 'tactical': return FALLBACK_CARTO_VOYAGER;
    }
  };

  // Fit bounds when disaster list updates or selection changes
  const fitAllMarkers = () => {
    if (!mapRef.current) return;
    const coords: [number, number][] = [];
    disasters.forEach(d => {
      if (d.location?.coordinates) coords.push(d.location.coordinates);
    });
    resources.forEach(r => {
      if (r.location?.coordinates) coords.push(r.location.coordinates);
    });
    teams.forEach(t => {
      if (t.location?.coordinates) coords.push(t.location.coordinates);
    });

    if (coords.length > 0) {
      const bounds = coords.reduce(
        (acc, c) => ({
          minLng: Math.min(acc.minLng, c[0]),
          maxLng: Math.max(acc.maxLng, c[0]),
          minLat: Math.min(acc.minLat, c[1]),
          maxLat: Math.max(acc.maxLat, c[1])
        }),
        {
          minLng: coords[0][0],
          maxLng: coords[0][0],
          minLat: coords[0][1],
          maxLat: coords[0][1]
        }
      );

      mapRef.current.fitBounds(
        [
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat]
        ],
        { padding: 70, duration: 1200 }
      );
    }
  };

  // Fly to selected disaster if prop changes
  useEffect(() => {
    if (selectedDisasterId && mapRef.current) {
      const target = disasters.find(d => d.id === selectedDisasterId);
      if (target?.location?.coordinates) {
        setPopupInfo(target);
        mapRef.current.flyTo({
          center: target.location.coordinates,
          zoom: 7.5,
          pitch: 45,
          duration: 1500
        });
      }
    }
  }, [selectedDisasterId, disasters]);

  const handleViewStateChange = (event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  };

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

  const filteredDisasters = useMemo(() => {
    if (!searchTerm.trim()) return disasters;
    const s = searchTerm.toLowerCase();
    return disasters.filter(d => 
      d.title.toLowerCase().includes(s) || 
      d.location_name.toLowerCase().includes(s) ||
      d.type.toLowerCase().includes(s)
    );
  }, [disasters, searchTerm]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 font-sans border border-slate-800/80 shadow-2xl">
      {/* HUD Header Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Telemetry Pill */}
        <div className="pointer-events-auto flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/60 shadow-lg text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold tracking-wider">TACTICAL MAP FEED</span>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
          <div className="text-slate-400 font-mono hidden sm:flex items-center space-x-2">
            <span>ZOOM: <strong className="text-white">{viewState.zoom.toFixed(1)}</strong></span>
            <span>LAT: <strong className="text-white">{viewState.latitude.toFixed(2)}</strong></span>
            <span>LNG: <strong className="text-white">{viewState.longitude.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="pointer-events-auto flex-1 max-w-xs sm:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sector, zone, or incident..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 backdrop-blur-md text-xs text-white placeholder-slate-400 pl-8 pr-4 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-blue-500/80 shadow-lg"
            />
            <Crosshair className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* Fit all button */}
          <button
            onClick={fitAllMarkers}
            title="Auto-fit all active emergency zones"
            className="flex items-center space-x-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-slate-200 hover:text-white px-3 py-2 rounded-xl border border-slate-700/60 transition-all text-xs shadow-lg active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline font-medium">Reset View</span>
          </button>

          {/* Layer toggles popover trigger */}
          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border transition-all text-xs shadow-lg active:scale-95 backdrop-blur-md ${
              showLayerDrawer 
                ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20' 
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/60 text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Layers & Style</span>
          </button>
        </div>
      </div>

      {/* Layer Control Panel (Floating Drawer) */}
      {showLayerDrawer && (
        <div className="absolute top-16 right-4 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-semibold text-white tracking-wide flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Map Layer Controls</span>
            </h4>
            <button 
              onClick={() => setShowLayerDrawer(false)}
              className="text-slate-400 hover:text-white text-base leading-none p-1"
            >
              ×
            </button>
          </div>

          {/* Basemap Switcher */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Tactical Basemap
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {Object.values(BASEMAP_METADATA).map(bm => {
                const Icon = bm.icon;
                const active = activeBasemap === bm.id;
                return (
                  <button
                    key={bm.id}
                    onClick={() => setActiveBasemap(bm.id as any)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-left transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[11px] truncate">{bm.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mapbox Token Status & Dynamic Config */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${hasToken ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-[10px] font-mono font-medium text-slate-300">
                  {hasToken ? 'Mapbox Live Vector' : 'Raster Tile Fallback'}
                </span>
              </div>
              <button
                onClick={() => setShowTokenSettings(!showTokenSettings)}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-mono flex items-center space-x-0.5"
              >
                <Key className="w-2.5 h-2.5 mr-0.5" />
                <span>{showTokenSettings ? 'Close' : 'Token'}</span>
              </button>
            </div>

            {hasToken && (
              <p className="text-[9px] font-mono text-slate-500 truncate">
                Active: {activeToken.slice(0, 16)}...
              </p>
            )}

            {showTokenSettings && (
              <div className="pt-1.5 space-y-1.5 border-t border-slate-800/80">
                <input
                  type="text"
                  placeholder="Paste Mapbox pk.eyJ1... key"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (tokenInput.trim()) {
                      setActiveToken(tokenInput.trim());
                      mapboxgl.accessToken = tokenInput.trim();
                      setTokenInput('');
                      setShowTokenSettings(false);
                    }
                  }}
                  className="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Save & Reload Basemap
                </button>
              </div>
            )}
          </div>

          {/* Overlays Toggle */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Hazards & Infrastructure
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'Incident Markers', state: showDisasters, set: setShowDisasters, color: 'text-red-400' },
                { label: 'Response Units', state: showTeams, set: setShowTeams, color: 'text-emerald-400' },
                { label: 'Supply Depots', state: showResources, set: setShowResources, color: 'text-blue-400' },
                { label: 'Evacuation Zones', state: showEvacZones, set: setShowEvacZones, color: 'text-amber-400' },
                { label: 'Flood Hazard Layer', state: showFloodHazard, set: setShowFloodHazard, color: 'text-cyan-400' },
                { label: 'Emergency Rescue Lines', state: showRescueRoutes, set: setShowRescueRoutes, color: 'text-green-400' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => item.set(!item.state)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                    item.state 
                      ? 'bg-slate-800/80 border-slate-700 text-slate-100' 
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <span className={`font-medium ${item.state ? item.color : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  {item.state ? (
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Mapbox GL Canvas */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleViewStateChange}
        mapboxAccessToken={activeToken || undefined}
        mapStyle={getMapStyle(activeBasemap) as any}
        onLoad={() => {
          setIsMapLoaded(true);
          if (mapRef.current) {
            mapRef.current.resize();
          }
        }}
        onError={(e) => {
          console.warn("Mapbox render event:", e);
        }}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        maxPitch={65}
      >
        <GeolocateControl 
          position="bottom-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
        />
        <FullscreenControl position="bottom-right" />
        <NavigationControl position="bottom-right" showCompass={true} showZoom={true} visualizePitch={true} />

        {/* Evacuation Zones Layer */}
        {showEvacZones && (
          <Source id="evac-zones" type="geojson" data={sampleEvacuationZones as any}>
            <Layer
              id="evacuation-zones-fill"
              type="fill"
              paint={{
                'fill-color': [
                  'match',
                  ['get', 'risk'],
                  'high', 'rgba(239, 68, 68, 0.25)',
                  'medium', 'rgba(245, 158, 11, 0.25)',
                  'rgba(59, 130, 246, 0.2)'
                ],
                'fill-outline-color': [
                  'match',
                  ['get', 'risk'],
                  'high', '#ef4444',
                  'medium', '#f59e0b',
                  '#3b82f6'
                ]
              }}
            />
            <Layer
              id="evacuation-zones-line"
              type="line"
              paint={{
                'line-color': [
                  'match',
                  ['get', 'risk'],
                  'high', '#ef4444',
                  'medium', '#f59e0b',
                  '#3b82f6'
                ],
                'line-width': 2,
                'line-dasharray': [3, 2]
              }}
            />
          </Source>
        )}

        {/* Flooded Areas Layer */}
        {showFloodHazard && (
          <Source id="flood-hazard" type="geojson" data={sampleFloodedAreas as any}>
            <Layer
              id="flooded-areas-fill"
              type="fill"
              paint={{
                'fill-color': 'rgba(14, 165, 233, 0.35)'
              }}
            />
            <Layer
              id="flooded-areas-line"
              type="line"
              paint={{
                'line-color': '#0284c7',
                'line-width': 2.5,
                'line-dasharray': [2, 1]
              }}
            />
          </Source>
        )}

        {/* Rescue Lines Layer */}
        {showRescueRoutes && (
          <Source id="rescue-routes" type="geojson" data={sampleRescueRoutes as any}>
            <Layer
              id="rescue-routes-line"
              type="line"
              paint={{
                'line-color': '#10b981',
                'line-width': 3.5,
                'line-dasharray': [2, 1]
              }}
            />
          </Source>
        )}

        {/* Disaster Markers */}
        {showDisasters && filteredDisasters.map(disaster => {
          if (!disaster.location?.coordinates) return null;
          const [lng, lat] = disaster.location.coordinates;
          const Icon = getDisasterIcon(disaster.type);
          const isSelected = selectedDisasterId === disaster.id;

          const severityBg = 
            disaster.severity >= 5 ? 'bg-red-600 shadow-red-500/50' :
            disaster.severity >= 4 ? 'bg-orange-600 shadow-orange-500/50' :
            disaster.severity >= 3 ? 'bg-amber-500 shadow-amber-500/50' :
            'bg-blue-600 shadow-blue-500/50';

          return (
            <Marker
              key={disaster.id}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(disaster);
                setSelectedResource(null);
                setSelectedTeam(null);
                onDisasterSelect?.(disaster.id);
              }}
            >
              <div className="relative group cursor-pointer transform hover:scale-125 transition-transform duration-200">
                {/* Radar pulse ping */}
                <div className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${severityBg}`}></div>
                
                {/* Marker Center Pill */}
                <div className={`relative flex items-center justify-center p-2 rounded-full border-2 border-white shadow-xl ${severityBg} ${
                  isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''
                }`}>
                  <Icon className="w-4 h-4 text-white" />
                  <span className="absolute -top-1 -right-1 bg-slate-900 border border-white text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {disaster.severity}
                  </span>
                </div>

                {/* Floating Label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-slate-900/90 text-[10px] text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-slate-700 pointer-events-none">
                  {disaster.title}
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Resource Markers */}
        {showResources && resources.map(resource => {
          if (!resource.location?.coordinates) return null;
          const [lng, lat] = resource.location.coordinates;
          const Icon = RESOURCE_ICONS[resource.type] || Box;

          return (
            <Marker
              key={resource.id}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedResource(resource);
                setPopupInfo(null);
                setSelectedTeam(null);
              }}
            >
              <div className="cursor-pointer transform hover:scale-125 transition-transform bg-slate-900/90 hover:bg-slate-800 p-1.5 rounded-lg border border-blue-500 shadow-md">
                <Icon className={`w-3.5 h-3.5 ${
                  resource.status === 'deployed' ? 'text-blue-400' :
                  resource.status === 'in-transit' ? 'text-amber-400' :
                  'text-emerald-400'
                }`} />
              </div>
            </Marker>
          );
        })}

        {/* Team Markers */}
        {showTeams && teams.map(team => {
          if (!team.location?.coordinates) return null;
          const [lng, lat] = team.location.coordinates;

          return (
            <Marker
              key={team.id}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedTeam(team);
                setPopupInfo(null);
                setSelectedResource(null);
              }}
            >
              <div className="cursor-pointer transform hover:scale-125 transition-transform bg-slate-900/90 hover:bg-slate-800 p-1.5 rounded-full border border-emerald-500 shadow-md">
                <Users className={`w-3.5 h-3.5 ${
                  team.status === 'responding' ? 'text-amber-400 animate-pulse' :
                  team.status === 'on-site' ? 'text-blue-400' :
                  'text-emerald-400'
                }`} />
              </div>
            </Marker>
          );
        })}

        {/* Disaster Rich Popup */}
        {popupInfo && popupInfo.location?.coordinates && (
          <Popup
            longitude={popupInfo.location.coordinates[0]}
            latitude={popupInfo.location.coordinates[1]}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="emergency-popup z-30"
            offset={20}
          >
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 max-w-sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold tracking-wider inline-block mb-1 ${
                    popupInfo.severity >= 4 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    popupInfo.severity >= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    LEVEL {popupInfo.severity} &bull; {popupInfo.type}
                  </span>
                  <h3 className="font-bold text-base text-white leading-snug">{popupInfo.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {popupInfo.description || 'Active emergency scenario monitoring.'}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Sector</span>
                  <span className="font-medium text-slate-200">{popupInfo.location_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Radius</span>
                  <span className="font-medium text-slate-200">{popupInfo.affected_radius_km} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Estimated Affected</span>
                  <span className="font-medium text-slate-200">{popupInfo.affected_population?.toLocaleString() || 'Calculating'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Status</span>
                  <span className="font-medium text-emerald-400 capitalize">{popupInfo.status}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onDisasterSelect?.(popupInfo.id);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Select Sector</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Popup>
        )}

        {/* Resource Popup */}
        {selectedResource && selectedResource.location?.coordinates && (
          <Popup
            longitude={selectedResource.location.coordinates[0]}
            latitude={selectedResource.location.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedResource(null)}
            closeButton={true}
            closeOnClick={false}
            offset={15}
          >
            <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 max-w-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">
                  {selectedResource.type}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium capitalize">
                  {selectedResource.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{selectedResource.name}</h4>
              <p className="text-xs text-slate-300 mb-2">{selectedResource.description}</p>
              <div className="text-xs bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stock Available:</span>
                  <span className="font-semibold text-white">{selectedResource.quantity} {selectedResource.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hub:</span>
                  <span className="text-slate-200">{selectedResource.location_name}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}

        {/* Team Popup */}
        {selectedTeam && selectedTeam.location?.coordinates && (
          <Popup
            longitude={selectedTeam.location.coordinates[0]}
            latitude={selectedTeam.location.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedTeam(null)}
            closeButton={true}
            closeOnClick={false}
            offset={15}
          >
            <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 max-w-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  {selectedTeam.type} UNIT
                </span>
                <span className="text-[10px] text-amber-400 font-medium capitalize">
                  {selectedTeam.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{selectedTeam.name}</h4>
              <div className="text-xs bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Personnel:</span>
                  <span className="font-semibold text-white">{selectedTeam.current_members} / {selectedTeam.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deployment Base:</span>
                  <span className="text-slate-200">{selectedTeam.location_name}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Bottom Floating Legend Pill */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-[11px] text-slate-300">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Catastrophe (Lv 4-5)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Moderate (Lv 3)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Supply Hub</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Tactical Unit</span>
        </div>
      </div>
    </div>
  );
}
