import EventEmitter from 'eventemitter3';

class WebSocketManager extends EventEmitter {
  ws: WebSocket | null = null;
  reconnectInterval: number = 5000;
  url: string = '';

  connect(url: string) {
    this.url = url;
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.emit('open');
    };
    this.ws.onmessage = (event) => {
      console.log('WebSocket message:', event.data);
      this.emit('message', event.data);
    };
    this.ws.onclose = () => {
      console.log('WebSocket closed, attempting reconnection...');
      this.emit('close');
      setTimeout(() => {
        this.connect(this.url);
      }, this.reconnectInterval);
    };
    this.ws.onerror = (error) => {
      console.log('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  send(data: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new WebSocketManager();
