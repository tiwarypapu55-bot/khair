import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { Radio, RefreshCw, X, CheckCircle2 } from 'lucide-react';

export const SyncNotificationToast: React.FC = () => {
  const { syncNotice, clearSyncNotice, syncState, forceSyncWithServer } = useHospital();

  if (!syncNotice) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in shadow-2xl rounded-lg bg-slate-900 border border-emerald-500/40 text-white p-4 flex items-start gap-3 backdrop-blur-md">
      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-md shrink-0 mt-0.5">
        <Radio className="w-5 h-5 animate-pulse" />
      </div>
      <div className="flex-1 pr-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Live Synchronized
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {syncState.connectedClients > 1 ? `${syncState.connectedClients} devices active` : 'Server synced'}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200 mt-0.5 leading-snug">
          {syncNotice}
        </p>
      </div>
      <button
        onClick={clearSyncNotice}
        className="text-slate-400 hover:text-white p-1 rounded transition hover:bg-slate-800 shrink-0"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
