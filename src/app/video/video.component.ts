import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket/socket.service';
import { PeerService } from '../services/peer/peer.service';
import Peer from 'peerjs';
import { CommonModule } from '@angular/common';

interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}
const gdmOptions = {
  video: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};
const gumOptions = {
  audio: true,
  video: {
    width: { ideal: 640 },
    height: { ideal: 360 },
  },
};

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})

export class VideosComponent implements OnInit {
  isCallStarted = false;
  ownID: string;
  currentCall: any;
  peerList: string[];
  currentStream: any;
  videos: VideoElement[];
  calls: any = [];

  constructor(
    private socketService: SocketService,
    private peerService: PeerService
  ) {
    this.ownID = this.peerService.myPeerId;
    this.peerList = [];
    this.videos = [];
  }

  ngOnInit() {
    this.socketService.getPeerID().subscribe((peerID: any) => {
      console.log('if a peer being ready to be called', `Calling ${peerID}`);
      // put conditon for someone to be called
      if (peerID !== this.ownID) {
        this.peerList.push(peerID);
      }
    });
  }

  addMyVideo(stream: MediaStream) {
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.peerService.myPeerId,
    });
  }

  addOtherUserVideo(userId: string, stream: MediaStream) {
    let newVideo = {
      muted: false,
      srcObject: stream,
      userId,
    };

    let existing = false;
    console.log(this.videos, userId);
    this.videos.forEach((v, i, newVideos) => {
      if (v.userId == userId) {
        existing = true;
        newVideos[i] = newVideo;
      }
    });
    if (existing == false) {
      this.videos.push(newVideo);
    }
  }

  answering(stream: MediaStream) {
    this.peerService.myPeer.on('call', (call: any) => {
      call.answer(stream);
      this.calls.push(call);
  
      call.on('stream', (otherUserVideoStream: MediaStream) => {
        console.log('Receiving other user stream after answering');
        this.addOtherUserVideo(call.metadata.peerId, otherUserVideoStream);
      });
  
      call.on('close', () => {
        console.log('Call closed');
        this.videos = this.videos.filter((video) => video.userId !== call.metadata.peerId);
        this.calls = this.calls.filter((c: any) => c !== call);
      });
    });
  }

  async streamCamera() {
    this.currentStream = await navigator.mediaDevices.getUserMedia(gumOptions);
    this.addMyVideo(this.currentStream);
    if (this.peerService.myPeer.disconnected) {
      await this.peerService.myPeer.reconnect();
    }
    this.socketService.peerID(this.peerService.myPeerId);
    this.answering(this.currentStream);
    // this.calling (stream);
    this.isCallStarted;
  }

  async streamScreen() {
    this.currentStream = await navigator.mediaDevices.getDisplayMedia(
      gdmOptions
    );
    this.addMyVideo(this.currentStream);
    if (this.peerService.myPeer.disconnected) {
      await this.peerService.myPeer.reconnect();
    }

    this.socketService.peerID(this.peerService.myPeerId);

    this.answering(this.currentStream);
    // this.calling(stream);
    this.isCallStarted = true;
  }

  calling(peerID: string) {
    if (confirm(`Do you want to call ${peerID}`)) {
      const call = this.peerService.myPeer.call(peerID, this.currentStream, {
        metadata: { peerId: this.ownID },
      });

      this.currentCall = call;
      this.calls.push(call);

      console.log(call);
      call.on('stream', (otherUserVideoStream: MediaStream) => {
        console.log('receiving other user stream after the connection');
        this.addOtherUserVideo(peerID, otherUserVideoStream);
      });

      call.on('close', () => {
        this.videos = this.videos.filter((video) => video.userId !== peerID);
        this.calls = this.calls.filter((c: any) => c !== call);
      });
    }
  }

  endCall() {
    // Implement the logic to end the call
    this.isCallStarted = false;
    // Stop the current stream
    this.currentStream.getTracks().forEach((track: any) => track.stop());
    // Close all peer connections
    this.calls.forEach((call: any) => call.close());
    // Clear the videos array
    this.videos = [];
    // Clear the calls array
    this.calls = [];
  }
  
}

