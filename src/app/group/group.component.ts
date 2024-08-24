import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../services/group/group.service';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../services/channel/channel.service';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent implements OnInit {
  group: any = null;
  groupEditData: any;
  channels: any[] = [];
  userData: any;
  currentRole: string = '';
  isEditMode: boolean = false;
  allUsers: any;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private activeUserService: ActiveUserService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getUserProfile();

    this.getAllUsers();

    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroupDetails(parseInt(groupId, 10));
    }
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.groupEditData = null; // Clear edit data when exiting edit mode
    } else {
      this.groupEditData = { ...this.group }; // Create a copy of the user data for editing
    }
    this.isEditMode = !this.isEditMode;
  }

  saveDetails(): void {
  //  this.activeUserService.updateUserData(this.userEditData); - Change when edit group added !!! HERE !!!
    this.group = { ...this.groupEditData }; // Update the original data after saving
    this.toggleEditMode(); // Exit edit mode after saving
    alert('Group updated successfully!');
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  getAllUsers(): void {
    this.userService.allUsers$.subscribe(users => {
      this.allUsers = users;
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId);
  }

  loadGroupDetails(id: number): void {
    this.groupService.getGroups().subscribe(groups => {
      this.group = groups.find(group => group.id === id);
      if (this.group) {
        console.log('Group details:', this.group); // Debugging log
        this.loadChannels(this.group.id); // Load channels after group is found
      } else {
        console.log('Group not found with ID:', id); // Debugging log
      }
    });
  }

  loadChannels(groupId: number): void {
    this.channelService.getChannelsByGroupId(groupId).subscribe(channels => {
      this.channels = channels;
      console.log('Channels for group:', this.channels); // Debugging log
    });
  }
}
