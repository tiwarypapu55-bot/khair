import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { RefreshCw, Radio, CheckCircle, Wifi, WifiOff, Server, Laptop, Smartphone } from 'lucide-react';

interface SyncStatusBadgeProps {
  variant?: 'compact' | 'detailed' | 'pill';
  className?: string;
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { syncState, forceSyncWithServer } = useHospital();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await forceSyncWithServer();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const getStatusColor = () => {
    switch (syncState.status) {
      case 'connected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'connecting':
      case 'reconnecting':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'disconnected':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusDot = () => {
    switch (syncState.status) {
      case 'connected':
        return 'bg-emerald-500 animate-pulse';
      case 'connecting':
      case 'reconnecting':
        return 'bg-amber-500 animate-ping';
      case 'disconnected':
      default:
        return 'bg-slate-400';
    }
  };

  const getStatusText = () => {
    switch (syncState.status) {
      case 'connected':
        return syncState.connectedClients > 1
          ? `Live Synced (${syncState.connectedClients} devices)`
          : 'Live Synced with Server';
      case 'connecting':
        return 'Connecting to Server...';
      case 'reconnecting':
        return 'Reconnecting Server...';
      case 'disconnected':
      default:
        return 'Offline (Local Mode)';
    }
  };

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor()} ${className}`}>
        <span className={`w-2 h-2 rounded-full ${getStatusDot()}`} />
        <span>{getStatusText()}</span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Force Sync with Server"
          className="ml-1 p-0.5 hover:bg-black/5 rounded cursor-pointer transition text-current"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-4 rounded-lg border bg-white shadow-xs ${className}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${getStatusColor()}`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm">
                  Cross-Device & Server Live Sync
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor()}`}>
                  {syncState.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{getStatusText()}</span>
                {syncState.lastSyncedAt && (
                  <>
                    <span>•</span>
                    <span>Last synced: {new Date(syncState.lastSyncedAt).toLocaleTimeString()}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md text-xs font-semibold cursor-pointer transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded">
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span>Server v{syncState.serverVersion}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded">
            <Laptop className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active: {syncState.connectedClients} {syncState.connectedClients === 1 ? 'client' : 'clients'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded">
            <Smartphone className="w-3.5 h-3.5 text-purple-600" />
            <span>Cross-browser live</span>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border ${getStatusColor()} ${className}`}
      title={`Server Sync: ${syncState.status} (${syncState.connectedClients} active devices)`}
    >
      <span className={`w-2 h-2 rounded-full ${getStatusDot()}`} />
      <span className="hidden sm:inline">{getStatusText()}</span>
      <span className="sm:hidden">{syncState.status === 'connected' ? 'Synced' : 'Offline'}</span>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Sync with server"
        className="p-0.5 hover:bg-black/5 rounded cursor-pointer transition ml-0.5"
      >
        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
