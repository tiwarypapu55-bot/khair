/**
 * ServerSyncService
 * Real-time synchronization across devices, browsers, and the server.
 * Uses WebSockets for real-time live events, BroadcastChannel for zero-latency cross-tab sync,
 * and HTTP REST fallback for guaranteed persistence and initial hydration.
 */

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export interface ClientSyncMutation {
  id: string;
  type: string;
  payload: any;
  clientId: string;
  timestamp: string;
}

export interface SyncState {
  status: ConnectionStatus;
  connectedClients: number;
  lastSyncedAt: string | null;
  serverVersion: number;
}

type SyncEventListener = (event: {
  mutation: ClientSyncMutation;
  version: number;
  isRemote: boolean;
}) => void;

type StateChangeListener = (state: SyncState) => void;

class ServerSyncService {
  private ws: WebSocket | null = null;
  private clientId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 20;
  private reconnectTimer: any = null;
  private pingInterval: any = null;
  private broadcastChannel: BroadcastChannel | null = null;

  private state: SyncState = {
    status: 'disconnected',
    connectedClients: 1,
    lastSyncedAt: null,
    serverVersion: 0,
  };

  private eventListeners: Set<SyncEventListener> = new Set();
  private stateListeners: Set<StateChangeListener> = new Set();
  private processedMutationIds: Set<string> = new Set();

  constructor() {
    this.clientId = this.getOrCreateClientId();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('khair_sync_v2');
        this.broadcastChannel.onmessage = (e) => {
          if (e.data && e.data.type === 'CROSS_TAB_MUTATION') {
            const { mutation, version } = e.data;
            if (mutation && !this.processedMutationIds.has(mutation.id)) {
              this.processedMutationIds.add(mutation.id);
              this.notifyEventListeners({
                mutation,
                version: version || this.state.serverVersion,
                isRemote: true,
              });
            }
          }
        };
      } catch (err) {
        console.warn('[Sync] BroadcastChannel init note:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[Sync] Network online, reconnecting...');
        this.connect();
      });
      window.addEventListener('offline', () => {
        console.log('[Sync] Network offline');
        this.updateState({ status: 'disconnected' });
      });
    }
  }

  private getOrCreateClientId(): string {
    if (typeof window === 'undefined') return 'server';
    let id = sessionStorage.getItem('khair_sync_client_id');
    if (!id) {
      id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('khair_sync_client_id', id);
    }
    return id;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getState(): SyncState {
    return { ...this.state };
  }

  public onSyncEvent(listener: SyncEventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  public onStateChange(listener: StateChangeListener): () => void {
    this.stateListeners.add(listener);
    listener(this.getState());
    return () => this.stateListeners.delete(listener);
  }

  private updateState(partial: Partial<SyncState>) {
    this.state = { ...this.state, ...partial };
    this.stateListeners.forEach((l) => l(this.getState()));
  }

  private notifyEventListeners(payload: {
    mutation: ClientSyncMutation;
    version: number;
    isRemote: boolean;
  }) {
    this.eventListeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (e) {
        console.error('[Sync] Listener error:', e);
      }
    });
  }

  public connect() {
    if (typeof window === 'undefined') return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.updateState({ status: this.reconnectAttempts === 0 ? 'connecting' : 'reconnecting' });

    try {
      const loc = window.location;
      const isHttps = loc.protocol === 'https:';
      const wsProto = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProto}//${loc.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[Sync] WebSocket connected to server');
        this.reconnectAttempts = 0;
        this.updateState({
          status: 'connected',
          lastSyncedAt: new Date().toISOString(),
        });

        // Setup keepalive ping every 25 seconds
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping', clientId: this.clientId }));
          }
        }, 25000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'sync:init') {
            this.updateState({
              serverVersion: data.version || 0,
              connectedClients: data.connectedClients || 1,
              lastSyncedAt: data.lastUpdated || new Date().toISOString(),
            });
            // Initial snapshot broadcast
            this.notifyEventListeners({
              mutation: {
                id: `init_${Date.now()}`,
                type: 'sync:init',
                payload: data.data,
                clientId: 'server',
                timestamp: data.lastUpdated || new Date().toISOString(),
              },
              version: data.version || 0,
              isRemote: true,
            });
          } else if (data.type === 'sync:event') {
            const mut: ClientSyncMutation = data.mutation;
            if (mut) {
              const isMine = mut.clientId === this.clientId || this.processedMutationIds.has(mut.id);
              this.processedMutationIds.add(mut.id);

              this.updateState({
                serverVersion: data.version || this.state.serverVersion,
                lastSyncedAt: data.timestamp || new Date().toISOString(),
              });

              if (!isMine) {
                this.notifyEventListeners({
                  mutation: mut,
                  version: data.version,
                  isRemote: true,
                });
              }
            }
          } else if (data.type === 'sync:clients_count') {
            this.updateState({ connectedClients: data.count || 1 });
          }
        } catch (err) {
          console.warn('[Sync] Message parse warning:', err);
        }
      };

      this.ws.onclose = () => {
        this.cleanupSocket();
        this.updateState({ status: 'disconnected' });
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[Sync] WebSocket connection note:', err);
        this.cleanupSocket();
        this.updateState({ status: 'disconnected' });
        this.scheduleReconnect();
      };
    } catch (e) {
      console.warn('[Sync] WebSocket setup exception:', e);
      this.updateState({ status: 'disconnected' });
      this.scheduleReconnect();
    }
  }

  private cleanupSocket() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
      } catch (e) {
        // ignore
      }
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[Sync] Maximum reconnect attempts reached; waiting for user action or network change');
      return;
    }

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts) + Math.random() * 500, 10000);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  public async fetchServerData(): Promise<{ success: boolean; data: any; version: number } | null> {
    try {
      const res = await fetch('/api/sync/all', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (json.success) {
        this.updateState({
          serverVersion: json.version,
          connectedClients: json.connectedClients || this.state.connectedClients,
          lastSyncedAt: json.lastUpdated || new Date().toISOString(),
        });
        return json;
      }
      return null;
    } catch (e) {
      console.warn('[Sync] fetchServerData note:', e);
      return null;
    }
  }

  public async bootstrapServer(initialData: any): Promise<boolean> {
    try {
      const res = await fetch('/api/sync/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData),
      });
      if (!res.ok) return false;
      const json = await res.json();
      return Boolean(json.success);
    } catch (e) {
      console.warn('[Sync] bootstrapServer note:', e);
      return false;
    }
  }

  public async sendMutation(type: string, payload: any): Promise<boolean> {
    const mutationId = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mutation: ClientSyncMutation = {
      id: mutationId,
      type,
      payload,
      clientId: this.clientId,
      timestamp: new Date().toISOString(),
    };

    // Mark as locally processed so we don't apply echoes
    this.processedMutationIds.add(mutationId);
    if (this.processedMutationIds.size > 300) {
      const arr = Array.from(this.processedMutationIds);
      this.processedMutationIds = new Set(arr.slice(arr.length - 150));
    }

    // 1. Cross-tab immediate broadcast
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'CROSS_TAB_MUTATION',
          mutation,
          version: this.state.serverVersion + 1,
        });
      } catch (e) {
        console.warn('[Sync] Cross-tab postMessage error:', e);
      }
    }

    // 2. WebSocket real-time delivery
    let wsSent = false;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'sync:mutation', mutation }));
        wsSent = true;
      } catch (e) {
        console.warn('[Sync] WS send failed, will rely on HTTP:', e);
      }
    }

    // 3. HTTP REST guaranteed persistence fallback
    try {
      const res = await fetch('/api/sync/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mutation),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.version) {
          this.updateState({
            serverVersion: json.version,
            lastSyncedAt: json.lastUpdated || new Date().toISOString(),
          });
        }
        return true;
      }
      return wsSent;
    } catch (err) {
      console.warn('[Sync] HTTP mutation note:', err);
      return wsSent;
    }
  }
}

export const serverSync = new ServerSyncService();
