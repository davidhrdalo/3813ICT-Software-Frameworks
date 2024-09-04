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
  group: any = null;
  channel: any = null;
  channelMembers: any[] = [];
  nonChannelMembers: any[] = [];
  channelId!: number;
  groupId!: number;
  userData: any;

  messagecontent: string = '';
  messages: any[] = [];
  ioConnection: any;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private socketService: SocketService,
    private activeUserService: ActiveUserService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.initIoConnection();
    this.getUserProfile();

    this.route.paramMap.subscribe((params) => {
      this.groupId = +params.get('id')!; // Assign groupId from route params
      this.channelId = +params.get('channelId')!; // Assign channelId from route params
      this.loadChannelDetails(this.groupId, this.channelId);
    });

    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroupDetails(parseInt(groupId, 10));
    }
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  loadGroupDetails(id: number): void {
    this.groupService.getGroups().subscribe((groups) => {
      this.group = groups.find((group) => group.id === id);
      if (this.group) {
        console.log('Group details:', this.group); // Debugging log
      } else {
        console.log('Group not found with ID:', id); // Debugging log
      }
    });
  }

  loadChannelDetails(groupId: number, channelId: number): void {
    this.channelService.getChannelsByGroupId(groupId).subscribe((channels) => {
      this.channel = channels.find((channel) => channel.id === channelId);
      if (this.channel) {
        console.log('Channel details:', this.channel); // Debugging log
        this.loadChannelMembers(channelId);
        this.loadNonChannelMembers(channelId, groupId);
      } else {
        console.log('Channel not found with ID:', channelId); // Debugging log
      }
    });
  }

  loadChannelMembers(channelId: number): void {
    this.channelService.getChannelMembers(channelId).subscribe((members) => {
      this.channelMembers = members;
    });
  }

  loadNonChannelMembers(channelId: number, groupId: number): void {
    this.channelService
      .getNonChannelMembers(channelId, groupId)
      .subscribe((nonMembers) => {
        this.nonChannelMembers = nonMembers;
      });
  }

  // Add a member to the channel
  addMemberToChannel(userId: number): void {
    this.channelService.addMember(this.channelId, userId).subscribe(
      (response) => {
        alert('User added to channel successfully!');
        // Refresh the lists after adding the user
        this.loadChannelMembers(this.channelId);
        this.loadNonChannelMembers(this.channelId, this.groupId);
      },
      (error) => {
        console.error('Error adding user to channel:', error);
      }
    );
  }

  // Remove a member from the channel
  removeMemberFromChannel(userId: number): void {
    this.channelService.removeMember(this.channelId, userId).subscribe(
      (response) => {
        alert('User removed from channel successfully!');
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
    this.ioConnection = this.socketService
      .getMessage()
      .subscribe((message: any) => {
        this.messages.push(message);
      });
  }

  public chat() {
    if (this.messagecontent) {
      this.socketService.send(this.messagecontent);
      this.messagecontent = '';
    } else {
      console.log('no message');
    }
  }
}
