import React, { useState } from 'react';
import { X, Box, Shield, Wind, Users, Truck, MapPin, Locate, Plus } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';

type ResourceInsert = Database['public']['Tables']['resources']['Insert'];

interface ResourceModalProps {
  onClose: () => void;
}

const RESOURCE_TYPES = [
  { id: 'medical', label: 'Medical', icon: Shield, desc: 'Trauma kits, ambulances, mobile units' },
  { id: 'food', label: 'Rations', icon: Box, desc: 'Ready-to-eat meals, infant formula' },
  { id: 'water', label: 'Potable Water', icon: Wind, desc: 'Water purification, tanker fleets' },
  { id: 'shelter', label: 'Shelter', icon: Box, desc: 'Tents, thermal blankets, bedding' },
  { id: 'rescue', label: 'Rescue Gear', icon: Users, desc: 'Zodiac boats, heavy cutters, harnesses' },
  { id: 'transport', label: 'Logistics', icon: Truck, desc: 'High-axle 4x4 trucks, air lift' }
];

const PRESET_DEPOTS = [
  { name: 'Kochi Emergency Center', lng: 76.2711, lat: 10.8505 },
  { name: 'Chennai Central Warehouse', lng: 80.2707, lat: 13.0827 },
  { name: 'Mumbai Disaster Response Hub', lng: 72.8777, lat: 19.0760 },
  { name: 'Bhuj Strategic Reserve', lng: 70.2196, lat: 23.2420 }
];

export default function ResourceModal({ onClose }: ResourceModalProps) {
  const { createResource } = useDisasterStore();
  const [formData, setFormData] = useState<Partial<ResourceInsert>>({
    type: 'medical',
    name: '',
    description: '',
    quantity: 100,
    unit: 'kits',
    location_name: '',
    status: 'available',
    location: {
      type: 'Point',
      coordinates: [76.2711, 10.8505]
    }
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
          location_name: prev.location_name || 'Current Depot Location (GPS)',
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
        throw new Error('Please specify valid coordinate locations for this depot.');
      }

      await createResource({
        ...formData,
        location: {
          type: 'Point',
          coordinates: [
            Number(formData.location.coordinates[0]),
            Number(formData.location.coordinates[1])
          ]
        }
      } as ResourceInsert);
      onClose();
    } catch (err) {
      console.error('Failed to add resource:', err);
      setError(err instanceof Error ? err.message : 'Failed to register resource');
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
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Deploy Supply Resource</h2>
              <p className="text-xs text-slate-400">Register new emergency relief stockpile into EOC inventory</p>
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
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Resource Category Grid */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Resource Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RESOURCE_TYPES.map(t => {
                const Icon = t.icon;
                const selected = formData.type === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setFormData(prev => ({ ...prev, type: t.id as any }))}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                      selected 
                        ? 'bg-blue-600/30 border-blue-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Item Designation / Title
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Field Surgical Trauma Unit - Tier 1"
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Quantity Count
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Metric Unit
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="units, beds, liters, kits"
              />
            </div>
          </div>

          {/* Location Name & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Depot / Facility Location
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <Locate className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Detecting...' : 'Use GPS'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              placeholder="e.g. Ernakulam Civil Hospital Depot"
            />

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-mono py-0.5">Preset Hubs:</span>
              {PRESET_DEPOTS.map((depot, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      location_name: depot.name,
                      location: { type: 'Point', coordinates: [depot.lng, depot.lat] }
                    }));
                  }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 flex items-center space-x-1 transition-all"
                >
                  <MapPin className="w-2.5 h-2.5 text-blue-400" />
                  <span>{depot.name}</span>
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                value={formData.location?.coordinates[0] ?? ''}
                onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                value={formData.location?.coordinates[1] ?? ''}
                onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
              />
            </div>
          </div>

          {/* Operational Status */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Readiness Status
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(['available', 'reserved', 'in-transit', 'deployed'] as const).map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                  className={`text-center py-1.5 px-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    formData.status === s 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Registering...' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
