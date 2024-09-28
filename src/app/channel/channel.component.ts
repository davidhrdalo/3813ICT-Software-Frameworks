import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../services/channel/channel.service';
import { CommonModule } from '@angular/common';
import { SocketService } from '../services/socket/socket.service';
import { FormsModule } from '@angular/forms';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { GroupService } from '../services/group/group.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css',
})
export class ChannelComponent implements OnInit {
  group: any = null; // Stores current group details
  channel: any = null; // Stores current channel details
  channelMembers: any[] = []; // List of channel members
  nonChannelMembers: any[] = []; // List of non-members in the group
  channelId!: string; // ID of the current channel
  groupId!: string; // ID of the current group
  userData: any; // Current user data

  messagecontent: string = ''; // Message to send in chat
  messages: any[] = []; // Chat messages array
  ioConnection: any; // Socket connection

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private socketService: SocketService,
    private activeUserService: ActiveUserService,
    private groupService: GroupService
  ) {}

  // Lifecycle hook: called after the component is initialized
  ngOnInit(): void {
    this.initIoConnection(); // Initialize socket connection for chat
    this.getUserProfile(); // Load user profile data

    // Subscribe to route parameters to get group and channel IDs
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('id')!; // Get groupId from the route
      this.channelId = params.get('channelId')!; // Get channelId from the route
      this.loadChannelDetails(this.groupId, this.channelId); // Load channel details
    });

    // Alternative way to load group details from snapshot
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroupDetails(groupId);
    }
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

  // Initialize socket connection for chat
  private initIoConnection() {
    this.socketService.initSocket();
    this.ioConnection = this.socketService
      .getMessage()
      .subscribe((message: any) => {
        this.messages.push(message); // Push received messages to the chat array
      });
  }

  // Send a message through the socket
  public chat() {
    if (this.messagecontent) {
      this.socketService.send(this.messagecontent); // Send message via socket
      this.messagecontent = ''; // Clear input field
    } else {
      console.log('No message'); // Log if message content is empty
    }
  }
}