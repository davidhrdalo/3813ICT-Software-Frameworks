import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../services/channel/channel.service';
import { CommonModule } from '@angular/common';
import { SocketService } from '../services/socket/socket.service';
import { FormsModule } from '@angular/forms';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { GroupService } from '../services/group/group.service';
import { VideosComponent } from '../video/video.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, FormsModule, VideosComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css',
})
export class ChannelComponent implements OnInit, OnDestroy {
  group: any = null; // Stores current group details
  channel: any = null; // Stores current channel details
  channelMembers: any[] = []; // List of channel members
  nonChannelMembers: any[] = []; // List of non-members in the group
  channelId: string = ''; // ID of the current channel
  groupId: string = ''; // ID of the current group
  userData: any; // Current user data

  messagecontent: string = ''; // Message to send in chat
  messages: any[] = []; // Chat messages array

  selectedFile: any = null;
  imagepath = '';

  private messageSubscriptions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private socketService: SocketService,
    private activeUserService: ActiveUserService,
    private groupService: GroupService
  ) {}

  // Lifecycle hook: called after the component is initialized
  ngOnInit(): void {
    this.getUserProfile();

    // Subscribe to route parameters
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('id') || '';
      this.channelId = params.get('channelId') || '';
      if (this.groupId && this.channelId) {
        this.loadChannelDetails(this.groupId, this.channelId);
        this.initIoConnection(); // Initialize socket connection here
      } else {
        console.error('Group ID or Channel ID is missing in route parameters');
      }
    });
  }

  ngOnDestroy(): void {
    // Leave the channel
    if (this.channelId) {
      this.socketService.leaveChannel(this.channelId);
    }

    // Unsubscribe from all subscriptions
    this.messageSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Get the current user's profile
  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  // Load group details by ID
  loadGroupDetails(id: string): void {
    this.groupService.getGroups().subscribe((groups) => {
      this.group = groups.find((group) => group._id === id);
      if (this.group) {
        console.log('Group details:', this.group); // Debugging log
      } else {
        console.log('Group not found with ID:', id); // Debugging log
      }
    });
  }

  // Load channel details based on groupId and channelId
  loadChannelDetails(groupId: string, channelId: string): void {
    this.channelService.getChannelsByGroupId(groupId).subscribe((channels) => {
      this.channel = channels.find((channel) => channel._id === channelId);
      if (this.channel) {
        console.log('Channel details:', this.channel); // Debugging log
        this.loadChannelMembers(channelId); // Load members of the channel
        this.loadNonChannelMembers(channelId, groupId); // Load non-members
      } else {
        console.log('Channel not found with ID:', channelId); // Debugging log
      }
    });
  }

  // Load members of the current channel
  loadChannelMembers(channelId: string): void {
    this.channelService.getChannelMembers(channelId).subscribe((members) => {
      this.channelMembers = members;
    });
  }

  // Load group members who are not in the current channel
  loadNonChannelMembers(channelId: string, groupId: string): void {
    this.channelService
      .getNonChannelMembers(channelId, groupId)
      .subscribe((nonMembers) => {
        this.nonChannelMembers = nonMembers;
      });
  }

  // Add a member to the channel
  addMemberToChannel(userId: string): void {
    this.channelService.addMember(this.channelId, userId).subscribe(
      (response) => {
        alert('User added to channel successfully!');
        // Refresh members list after adding user
        this.loadChannelMembers(this.channelId);
        this.loadNonChannelMembers(this.channelId, this.groupId);
      },
      (error) => {
        console.error('Error adding user to channel:', error);
      }
    );
  }

  // Remove a member from the channel
  removeMemberFromChannel(userId: string): void {
    this.channelService.removeMember(this.channelId, userId).subscribe(
      (response) => {
        alert('User removed from channel successfully!');
        // Refresh members list after removing user
        this.loadChannelMembers(this.channelId);
        this.loadNonChannelMembers(this.channelId, this.groupId);
      },
      (error) => {
        console.error('Error removing user from channel:', error);
      }
    );
  }

  private initIoConnection() {
    this.socketService.initSocket();

    // Join the channel
    if (this.channelId) {
      this.socketService.joinChannel(this.channelId);
    } else {
      console.error('Channel ID is undefined when attempting to join channel');
    }

    // Load chat history
    this.socketService.getChatHistory(this.channelId).subscribe(
      (historyMessages: any[]) => {
        this.messages = historyMessages;
      },
      (error) => {
        console.error('Error loading chat history:', error);
      }
    );

    // Listen for new messages
    const messageSub = this.socketService
      .getMessages(this.channelId)
      .subscribe((message: any) => {
        this.messages.push(message);
      });
    this.messageSubscriptions.push(messageSub);

    // Listen for user joined events
    const userJoinedSub = this.socketService
      .onUserJoined(this.channelId)
      .subscribe((data: any) => {
        this.messages.push({
          system: true,
          message: `${data.username} has joined the channel`,
        });
      });
    this.messageSubscriptions.push(userJoinedSub);

    // Listen for user left events
    const userLeftSub = this.socketService
      .onUserLeft(this.channelId)
      .subscribe((data: any) => {
        this.messages.push({
          system: true,
          message: `${data.username} has left the channel`,
        });
      });
    this.messageSubscriptions.push(userLeftSub);
  }

  public chat() {
    if (this.messagecontent && this.channelId) {
      this.socketService
        .sendMessage(this.channelId, this.messagecontent)
        .subscribe(
          () => {
            // Message sent successfully
          },
          (error) => {
            console.error('Error sending message', error);
          }
        );
      this.messagecontent = '';
    } else {
      console.log('No message or channel ID is undefined');
    }
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (this.selectedFile && this.channelId) {
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);

      this.socketService.uploadImage(this.channelId, fd).subscribe(
        (response: any) => {
          console.log('Image upload successful:', response);
          const imageUrl = response.data.url;
          this.sendImageMessage(imageUrl);
          this.selectedFile = null; // Reset the file selection
        },
        (error) => {
          console.error('Error uploading image:', error);
          // Optionally, show an error message to the user
          // alert('Failed to upload image. Please try again.');
        }
      );
    } else {
      console.error('No file selected or channel ID is undefined');
      // Optionally, show an error message to the user
      // alert('Please select an image file first.');
    }
  }

  // Send a chat message containing the image URL
  sendImageMessage(imageUrl: string) {
    if (this.channelId) {
      this.socketService
        .sendImageMessage(this.channelId, imageUrl)
        .subscribe(
          () => {
            // Image message sent successfully
          },
          (error) => {
            console.error('Error sending image message', error);
          }
        );
    }
  }
}
