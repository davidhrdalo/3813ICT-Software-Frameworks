import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  public socketId: any;

  constructor() { }

  // Setup Connection to socket server
  initSocket() {
    this.socket = io(SERVER_URL);
    return () => { this.socket.disconnect(); }
  }

  // Emit a message to the socket server
  send(message: string) {
    this.socket.emit('message', message);
  }

  // Listen for "message" events from the socket server
  getMessage() {
    return new Observable(observer => {
      this.socket.on('message', (data: any) => { observer.next(data) });
    });
  }

  // Peer video support below
  peerID(message: string) {
    this.socket.emit('peerID', message);
  }

  getPeerID() {
    return new Observable(observer => {
      this.socket.on('peerID', (data: string) => {
        observer.next(data);
      });
    });
  }
}
