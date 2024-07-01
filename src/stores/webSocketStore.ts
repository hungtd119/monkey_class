// src/stores/webSocketStore.ts
import create from 'zustand';

interface WebSocketStore {
  socket: WebSocket | null;
  connected: boolean;
  connectWebSocket: () => () => void; 
}

const useWebSocketStore = create<WebSocketStore>((set) => ({
  socket: null,
  connected: false,
  connectWebSocket: () => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_URL_WEBSOCKET}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      set({ socket: ws, connected: true });
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      set({ socket: null, connected: false });
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  },
}));

export default useWebSocketStore;
