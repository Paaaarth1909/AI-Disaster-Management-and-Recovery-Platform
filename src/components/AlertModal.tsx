import React, { useState } from 'react';
import { X, Radio, Send, AlertTriangle, Megaphone, Smartphone, Mail, Globe2 } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';

type AlertInsert = Database['public']['Tables']['alerts']['Insert'];

interface AlertModalProps {
  onClose: () => void;
  disasterId?: string;
}

const CHANNELS = [
  { id: 'sms', label: 'Cellular SMS', icon: Smartphone },
  { id: 'emergency-broadcast', label: 'EAS Broadcast', icon: Radio },
  { id: 'app', label: 'Push App Alert', icon: Megaphone },
  { id: 'email', label: 'Agency Email', icon: Mail },
  { id: 'social-media', label: 'Public Web Feeds', icon: Globe2 }
];

export default function AlertModal({ onClose, disasterId }: AlertModalProps) {
  const { broadcastAlert, disasters } = useDisasterStore();
  const [formData, setFormData] = useState<Partial<AlertInsert>>({
    type: 'warning',
    title: '',
    message: '',
    severity: 4,
    channels: ['sms', 'emergency-broadcast', 'app'],
    status: 'draft',
    affected_area: {
      type: 'Polygon',
      coordinates: [[
        [76.15, 10.75],
        [76.45, 10.75],
        [76.45, 11.05],
        [76.15, 11.05],
        [76.15, 10.75]
      ]]
    },
    disaster_id: disasterId || (disasters[0]?.id ?? null)
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      if (!formData.channels || formData.channels.length === 0) {
        throw new Error('Please select at least one broadcast channel.');
      }

      await broadcastAlert({
        ...formData,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
      onClose();
    } catch (err) {
      console.error('Failed to broadcast alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to broadcast alert');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleChannel = (channelId: string) => {
    const current = formData.channels || [];
    if (current.includes(channelId)) {
      setFormData(prev => ({ ...prev, channels: current.filter(c => c !== channelId) }));
    } else {
      setFormData(prev => ({ ...prev, channels: [...current, channelId] }));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 w-full max-w-lg text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Emergency Broadcast Dispatch</h2>
              <p className="text-xs text-slate-400">Trigger multi-channel citizen & responder sirens</p>
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
          {/* Target Disaster Selector */}
          {disasters.length > 0 && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Associate with Incident
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                value={formData.disaster_id || ''}
                onChange={(e) => setFormData({ ...formData, disaster_id: e.target.value || null })}
              >
                <option value="">General Regional Alert (No specific disaster)</option>
                {disasters.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.location_name}) &bull; Lv {d.severity}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Alert Type Tabs */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Warning Severity Level
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(['warning', 'evacuation', 'update', 'all-clear'] as const).map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                  className={`text-center py-1.5 px-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    formData.type === t 
                      ? t === 'evacuation' 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-semibold' 
                        : t === 'warning'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-semibold'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
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
              Alert Subject Line
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. FLASH FLOOD WARNING: Mandatory Evacuation Order"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Broadcast Message Content
            </label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide explicit instructions: shelter locations, evacuation routes, helpline numbers..."
            />
          </div>

          {/* Distribution Channels */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Target Distribution Channels
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHANNELS.map(ch => {
                const Icon = ch.icon;
                const active = formData.channels?.includes(ch.id);
                return (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium">{ch.label}</span>
                  </button>
                );
              })}
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
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/30 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting sirens...' : 'Broadcast Siren Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
