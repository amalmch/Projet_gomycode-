import React, { useState } from 'react';
import { IndustrialEvent } from '../../types';
import { Calendar, Plus, X, AlertTriangle, ArrowUp, ArrowRight, ArrowDown, Clock, CheckCircle2 } from 'lucide-react';

const PRIORITY_CONFIG = {
  CRITICAL: { label: 'Critical', color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30', icon: AlertTriangle, sort: 0 },
  HIGH:     { label: 'High',     color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30', icon: ArrowUp, sort: 1 },
  MEDIUM:   { label: 'Medium',   color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30', icon: ArrowRight, sort: 2 },
  LOW:      { label: 'Low',      color: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30', icon: ArrowDown, sort: 3 },
};

const EVENT_TYPES = ['PREVENTIVE_MAINTENANCE', 'CORRECTIVE_MAINTENANCE', 'INSPECTION', 'SAFETY_DRILL', 'CALIBRATION', 'UPGRADE'];

interface EventsViewProps {
  events: IndustrialEvent[];
  onAddEvent?: (event: IndustrialEvent) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, onAddEvent }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: EVENT_TYPES[0],
    scheduled_at: '',
    machine_id: '',
    zone_id: '',
    priority: 'MEDIUM' as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    description: '',
  });

  // Local events (for demo — persists in component state since backend may not have this endpoint)
  const [localEvents, setLocalEvents] = useState<IndustrialEvent[]>([]);
  const allEvents = [...events, ...localEvents].sort((a, b) => {
    const pa = PRIORITY_CONFIG[a.priority || 'MEDIUM'].sort;
    const pb = PRIORITY_CONFIG[b.priority || 'MEDIUM'].sort;
    return pa - pb;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: IndustrialEvent = {
      id: `EVT-${Date.now().toString(36).toUpperCase()}`,
      title: form.title,
      type: form.type,
      scheduled_at: form.scheduled_at || new Date().toISOString(),
      machine_id: form.machine_id || undefined,
      zone_id: form.zone_id || undefined,
      status: 'SCHEDULED',
      priority: form.priority,
      description: form.description || undefined,
    };
    setLocalEvents((prev) => [...prev, newEvent]);
    if (onAddEvent) onAddEvent(newEvent);
    setForm({ title: '', type: EVENT_TYPES[0], scheduled_at: '', machine_id: '', zone_id: '', priority: 'MEDIUM', description: '' });
    setShowForm(false);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto p-4 glass-panel rounded-xl border border-slate-300 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase">
            Maintenance & Intervention Schedule
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-mono">
            {allEvents.length} Operations
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md transition-all"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? 'Cancel' : 'Schedule Event'}
          </button>
        </div>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-cyan-500/20 space-y-3 animate-float-in">
          <h3 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Schedule New Event</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. M-04 Hydraulic Valve Inspection"
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-400 transition-colors"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Priority</label>
              <div className="flex gap-1.5">
                {(Object.keys(PRIORITY_CONFIG) as Array<keyof typeof PRIORITY_CONFIG>).map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                        form.priority === p
                          ? `${cfg.color} border-current ring-1 ring-current/20`
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Target (Machine / Zone)</label>
              <input
                value={form.machine_id}
                onChange={(e) => setForm({ ...form, machine_id: e.target.value })}
                placeholder="e.g. M-04 or ZONE_B"
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the intervention..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              Schedule Event
            </button>
          </div>
        </form>
      )}

      {/* Events List (sorted by priority) */}
      <div className="space-y-3 font-mono">
        {allEvents.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No scheduled events. Click "Schedule Event" to create one.
          </div>
        )}
        {allEvents.map((evt) => {
          const priority = evt.priority || 'MEDIUM';
          const cfg = PRIORITY_CONFIG[priority];
          const PIcon = cfg.icon;

          return (
            <div key={evt.id} className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 flex items-center justify-between hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${cfg.color} flex items-center gap-1`}>
                    <PIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    {evt.type.replace(/_/g, ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.scheduled_at ? new Date(evt.scheduled_at).toLocaleString() : 'TBD'}</span>
                  <span>Target: {evt.machine_id || evt.zone_id || 'Plant-Wide'}</span>
                </div>
                {evt.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{evt.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 ml-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  evt.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                  evt.status === 'IN_PROGRESS' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 animate-pulse' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {evt.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                  {evt.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
