import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { ActiveUserService } from '../activeUser/activeUser.service';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  public socketId: any;

  constructor(
    private http: HttpClient,
    private activeUserService: ActiveUserService
  ) {}

  // Setup Connection to socket server
  initSocket() {
    this.socket = io(SERVER_URL);
    return () => {
      this.socket.disconnect();
    };
  }

  // Emit a message to the socket server for a specific channel
  sendMessage(channelId: string, message: string): Observable<any> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      console.error('No active user found');
      return new Observable(); // Return an empty observable to satisfy return type
    }

    const messageData = {
      channelId,
      userId: userData._id,
      username: userData.username,
      message,
      profilePic: userData.profileImg,
    };

    // Emit the message via socket
    this.socket.emit('channelMessage', messageData);

    // Also send the message to the server via HTTP POST
    return this.http.post(`${SERVER_URL}/api/chat/${channelId}`, messageData);
  }

  // Listen for "channelMessage" events from the socket server
  getMessages(channelId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(`channelMessage:${channelId}`, (data: any) => {
        observer.next(data);
      });
    });
  }

  // Get chat history for a specific channel
  getChatHistory(channelId: string): Observable<any[]> {
    return this.http.get<any[]>(`${SERVER_URL}/api/chat/${channelId}`);
  }

  // Join a specific channel
  joinChannel(channelId: string) {
    const userData = this.activeUserService.getUserData();
    if (userData) {
      this.socket.emit('joinChannel', {
        channelId,
        userId: userData._id,
        username: userData.username,
      });
    } else {
      console.error('No active user found when joining channel');
    }
  }

  // Leave a specific channel
  leaveChannel(channelId: string) {
    const userData = this.activeUserService.getUserData();
    if (userData) {
      this.socket.emit('leaveChannel', {
        channelId,
        userId: userData._id,
        username: userData.username,
      });
    } else {
      console.error('No active user found when leaving channel');
    }
  }

  // Listen for users joining the channel
  onUserJoined(channelId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(`userJoined:${channelId}`, (data: any) => {
        observer.next(data);
      });
    });
  }

  // Listen for users leaving the channel
  onUserLeft(channelId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(`userLeft:${channelId}`, (data: any) => {
        observer.next(data);
      });
    });
  }

  onUserEvent(channelId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(`userEvent`, (data: any) => {
        if (data.channelId === channelId) {
          observer.next(data);
        }
      });
    });
  }

  uploadImage(channelId: string, formData: FormData): Observable<any> {
    return this.http.post(
      `${SERVER_URL}/api/chat/${channelId}/upload`,
      formData
    );
  }

  sendImageMessage(channelId: string, imageUrl: string): Observable<any> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      console.error('No active user found');
      return new Observable();
    }

    const messageData = {
      channelId,
      userId: userData._id,
      username: userData.username,
      message: '', // No text message
      profilePic: userData.profileImg,
      imageUrl: imageUrl,
    };

    // Emit the message via socket
    this.socket.emit('channelMessage', messageData);

    // Send the message to the server via HTTP POST and return the Observable
    return this.http.post(`${SERVER_URL}/api/chat/${channelId}`, messageData);
  }

  // Peer video support below
  peerID(message: string) {
    this.socket.emit('peerID', message);
  }

  getPeerID() {
    return new Observable((observer) => {
      this.socket.on('peerID', (data: string) => {
        observer.next(data);
      });
    });
  }
}
