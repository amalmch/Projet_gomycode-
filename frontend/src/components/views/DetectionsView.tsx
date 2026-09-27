import React from 'react';
import { Incident, Action } from '../../types';
import { AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const DetectionsView: React.FC<{ incidents: Incident[], actions: Action[] }> = ({ incidents, actions }) => {
  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto p-4 glass-panel rounded-xl border border-slate-300 dark:border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase">
            CENTRAL INCIDENT & ANOMALY DETECTION CENTER
          </h2>
        </div>
        <span className="px-3 py-1 bg-red-950/60 border border-red-800/40 text-red-400 rounded-full text-xs font-mono font-bold">
          {incidents.filter((i) => i.status === 'ACTIVE').length} ACTIVE ALERTS
        </span>
      </div>

      {incidents.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
          ✓ All factory sectors nominal. Zero active risk events or threshold violations.
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => {
            const incPending = actions.filter(
              a => a.incident_id === incident.id && (a.status === 'AWAITING_APPROVAL' || a.status === 'PENDING')
            );
            const hasPending = incPending.length > 0;

            return (
            <div
              key={incident.id}
              className={`p-4 rounded-xl border space-y-3 font-mono ${
                incident.severity === 'CRITICAL'
                  ? 'bg-red-950/20 border-red-500/50 shadow-glow-red'
                  : 'bg-amber-950/20 border-amber-500/50 shadow-glow-amber'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    incident.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {incident.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    incident.status === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : hasPending
                        ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 animate-pulse'
                        : 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                  }`}>
                    {incident.status === 'RESOLVED' ? <CheckCircle2 className="w-3 h-3" /> : hasPending ? <Clock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    {incident.status === 'RESOLVED' ? 'RESOLVED' : hasPending ? `AWAITING AUTHORIZATION (${incPending.length})` : 'MITIGATING'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{incident.type.replace(/_/g, ' ')}</h3>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Confidence: <strong className="text-cyan-400">{Math.round(incident.confidence * 100)}%</strong></span>
                  <span>•</span>
                  <span>{new Date(incident.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-100 dark:bg-slate-950/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-900">
                <div>
                  <span className="text-slate-500 block text-[10px]">AFFECTED SECTOR & ASSETS:</span>
                  <span className="text-slate-700 dark:text-slate-200">{incident.zone} • {incident.affected_assets.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PERSONNEL IN PERIMETER:</span>
                  <span className="text-amber-400 font-bold">{incident.affected_workers.length} Workers ({incident.affected_workers.join(', ') || 'None'})</span>
                </div>
              </div>

              {/* Explainability Breakdown */}
              <div className="p-3 bg-white dark:bg-slate-900/90 rounded-lg border border-slate-300 dark:border-slate-800 text-xs space-y-1.5">
                <span className="text-cyan-400 font-bold block text-[10px]">AI COPILOT MULTI-AGENT EXPLAINABILITY:</span>
                <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed whitespace-pre-line">
                  {incident.ai_reasoning}
                </p>
              </div>

              {/* Evidence */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 text-[10px] block">CORROBORATING SENSOR EVIDENCE:</span>
                {incident.evidence.map((ev, idx) => (
                  <div key={idx} className="text-slate-600 dark:text-slate-300 text-[11px] flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">• [{ev.source}]</span>
                    <span>{ev.detail}</span>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
