import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
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
  channelName: string = '';
  channelDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private activeUserService: ActiveUserService,
    private userService: UserService,
    private router: Router,
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
    if (!this.groupEditData.name || !this.groupEditData.description) {
      alert('Please fill in all required fields.');
      return;
    }
  
    this.groupService.updateGroup(this.group.id, this.groupEditData).subscribe(
      (updatedGroup) => {
        this.group = updatedGroup; // Update the original group data with the saved data
        this.toggleEditMode(); // Exit edit mode after saving
        alert('Group updated successfully!');
      },
      (error) => {
        console.error('Error updating group:', error);
        alert('Failed to update group.');
      }
    );
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

  deleteGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe(
        () => {
          alert('Group deleted successfully!');
          this.router.navigate(['/profile']); // Navigate back to profile
        },
        (error) => {
          console.error('Error deleting group:', error);
          alert('Failed to delete group.');
        }
      );
    }
  }
  
  createChannel(): void {
    if (!this.channelName || !this.channelDescription) {
      alert('Please fill in all required fields.');
      return;
    }

    const channelData = {
      name: this.channelName,
      description: this.channelDescription,
      groupId: this.group.id,
    };

    this.channelService.createChannel(channelData).subscribe(
      (newChannel) => {
        this.channels.push(newChannel); // Add the new channel to the list
        this.channelName = '';
        this.channelDescription = '';
        alert('Channel created successfully!');
      },
      (error) => {
        console.error('Error creating channel:', error);
        alert('Failed to create channel.');
      }
    );
  }

  clearCreateChannel(): void {
    this.channelName = '';
    this.channelDescription = '';
  }
}
