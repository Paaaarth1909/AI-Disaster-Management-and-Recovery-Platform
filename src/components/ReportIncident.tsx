import React, { useState } from 'react';
import { AlertTriangle, X, MapPin, Locate, Send, ShieldAlert } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';

type ReportInsert = Database['public']['Tables']['reports']['Insert'];

interface ReportIncidentProps {
  onClose: () => void;
}

const PRESET_LOCATIONS = [
  { name: 'Kochi, Kerala', lng: 76.2711, lat: 10.8505 },
  { name: 'Chennai, TN', lng: 80.2707, lat: 13.0827 },
  { name: 'Mumbai, MH', lng: 72.8777, lat: 19.0760 },
  { name: 'Bhuj, Gujarat', lng: 70.2196, lat: 23.2420 },
  { name: 'Dehradun, UK', lng: 79.0193, lat: 30.0668 }
];

export default function ReportIncident({ onClose }: ReportIncidentProps) {
  const { createReport } = useDisasterStore();
  const [formData, setFormData] = useState<Partial<ReportInsert>>({
    type: 'incident',
    title: '',
    description: '',
    location_name: '',
    severity: 3,
    status: 'pending',
    location: {
      type: 'Point',
      coordinates: [76.2711, 10.8505]
    },
    images: []
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lng = Number(pos.coords.longitude.toFixed(4));
        const lat = Number(pos.coords.latitude.toFixed(4));
        setFormData(prev => ({
          ...prev,
          location_name: prev.location_name || 'My Current Location (GPS)',
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }));
      },
      (err) => {
        setLocating(false);
        setError(`Unable to retrieve GPS coordinates: ${err.message}`);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      if (!formData.location?.coordinates[0] || !formData.location?.coordinates[1]) {
        throw new Error('Please provide valid longitude & latitude coordinates.');
      }

      await createReport({
        ...formData,
        status: 'pending',
        images: [],
        location: {
          type: 'Point',
          coordinates: [
            Number(formData.location.coordinates[0]),
            Number(formData.location.coordinates[1])
          ]
        }
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoordinateChange = (type: 'longitude' | 'latitude', value: string) => {
    const numValue = Number(value);
    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: type === 'longitude' 
          ? [numValue, prev.location?.coordinates[1] || 0]
          : [prev.location?.coordinates[0] || 0, numValue]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 w-full max-w-lg text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Report New Incident</h2>
              <p className="text-xs text-slate-400">Broadcast crowdsourced or responder intelligence to EOC</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Incident Type Select */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Incident Category
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(['incident', 'damage', 'rescue-needed', 'update'] as const).map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                  className={`text-center py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    formData.type === t 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Incident Title
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Flash flood surge breaching river wall"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Detailed Intelligence Description
            </label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe casualties, access obstacles, water levels, or hazards..."
            />
          </div>

          {/* Location Name & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Sector / Location Name
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <Locate className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Acquiring GPS...' : 'Use My GPS'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              placeholder="e.g. Aluva Bridge Sector, Kochi"
            />

            {/* Quick Sector Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-mono py-0.5">Presets:</span>
              {PRESET_LOCATIONS.map((loc, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      location_name: loc.name,
                      location: { type: 'Point', coordinates: [loc.lng, loc.lat] }
                    }));
                  }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 flex items-center space-x-1 transition-all"
                >
                  <MapPin className="w-2.5 h-2.5 text-blue-400" />
                  <span>{loc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Longitude (&deg;E)
              </label>
              <input
                type="number"
                step="any"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                value={formData.location?.coordinates[0] ?? ''}
                onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                placeholder="76.2711"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Latitude (&deg;N)
              </label>
              <input
                type="number"
                step="any"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                value={formData.location?.coordinates[1] ?? ''}
                onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                placeholder="10.8505"
              />
            </div>
          </div>

          {/* Severity Slider */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Threat Severity Level
              </label>
              <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                (formData.severity ?? 3) >= 4 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                (formData.severity ?? 3) >= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                LEVEL {formData.severity ?? 3} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              className="w-full accent-red-500 cursor-pointer"
              value={formData.severity ?? 3}
              onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1 - Minor Alert</span>
              <span>3 - Moderate Crisis</span>
              <span>5 - Catastrophic</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/30 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting...' : 'Submit Incident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
