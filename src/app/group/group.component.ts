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
  group: any = null; // Stores current group details
  groupEditData: any; // Stores editable group data for edit mode
  channels: any[] = []; // List of group channels
  userData: any; // Logged-in user data
  currentRole: string = ''; // Role of the current user
  isEditMode: boolean = false; // Toggle for group edit mode
  isEditChannelMode: boolean = false; // Toggle for channel edit mode
  allUsers: any; // List of all users
  channelName: string = ''; // Name for new channel creation
  channelDescription: string = ''; // Description for new channel creation
  editChannelData: any = null; // Stores data for editing a channel
  activeMembers: any[] = []; // Active members of the group
  interestedUsers: any[] = []; // Users interested in joining the group

  // Upload img
  selectedfile: any = null;
  imagepath = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private activeUserService: ActiveUserService,
    private userService: UserService,
    private router: Router
  ) {}

  // Lifecycle hook for initializing component
  ngOnInit(): void {
    this.getUserProfile(); // Load user profile
    this.getAllUsers(); // Fetch all users

    // Get the group ID from the route and load the group details
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroupDetails(groupId);
    }
  }

  // Toggle group edit mode
  toggleEditMode(): void {
    if (this.isEditMode) {
      this.groupEditData = null; // Clear edit data if exiting edit mode
    } else {
      this.groupEditData = { ...this.group }; // Copy current group data for editing
    }
    this.isEditMode = !this.isEditMode;
  }

  // Save group details after editing
  saveDetails(): void {
    if (!this.groupEditData.name || !this.groupEditData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    this.groupService.updateGroup(this.group._id, this.groupEditData).subscribe(
      (updatedGroup) => {
        this.group = updatedGroup; // Update the group with saved data
        this.toggleEditMode(); // Exit edit mode
        alert('Group updated successfully!');
      },
      (error) => {
        console.error('Error updating group:', error);
        alert('Failed to update group.');
      }
    );
  }

  // Fetch the current user's profile
  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  // Fetch all users in the system
  getAllUsers(): void {
    this.userService.allUsers$.subscribe((users) => {
      this.allUsers = users;
    });
  }

  // Delete a user from the system
  deleteUser(userId: string): void {
    this.userService.deleteUser(userId);
  }

  // Load group details based on group ID
  loadGroupDetails(id: string): void {
    this.groupService.getGroups().subscribe((groups) => {
      this.group = groups.find((group) => group._id === id);
      if (this.group) {
        this.loadChannels(this.group._id); // Load channels for the group
        this.getActiveMembers(); // Fetch active members
        this.getInterestedUsers(); // Fetch interested users
      } else {
        console.log('Group not found with ID:', id); // Log if group not found
      }
    });
  }

  // Fetch active members of the group
  getActiveMembers(): void {
    if (this.group) {
      this.groupService.getActiveMembers(this.group._id).subscribe(
        (members) => {
          this.activeMembers = members;
        },
        (error) => {
          console.error('Error fetching active members:', error);
        }
      );
    }
  }

  // Fetch users interested in joining the group
  getInterestedUsers(): void {
    if (this.group) {
      this.groupService.getInterestedUsers(this.group._id).subscribe(
        (users) => {
          this.interestedUsers = users;
        },
        (error) => {
          console.error('Error fetching interested users:', error);
        }
      );
    }
  }

  // Load channels belonging to the group
  loadChannels(groupId: string): void {
    this.channelService.getChannelsByGroupId(groupId).subscribe((channels) => {
      this.channels = channels;
    });
  }

  // Delete the group and navigate back to profile
  deleteGroup(groupId: string): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe(
        () => {
          alert('Group deleted successfully!');
          this.router.navigate(['/profile']); // Navigate to profile after deletion
        },
        (error) => {
          console.error('Error deleting group:', error);
          alert('Failed to delete group.');
        }
      );
    }
  }

  // Create a new channel in the group
  createChannel(): void {
    if (!this.channelName || !this.channelDescription) {
      alert('Please fill in all required fields.');
      return;
    }

    const channelData = {
      name: this.channelName,
      description: this.channelDescription,
      groupId: this.group._id,
    };

    this.channelService.createChannel(channelData).subscribe(
      (newChannel) => {
        this.channels.push(newChannel); // Add new channel to the list
        this.clearCreateChannel(); // Clear input fields after creating channel
        alert('Channel created successfully!');
      },
      (error) => {
        console.error('Error creating channel:', error);
        alert('Failed to create channel.');
      }
    );
  }

  // Clear the channel creation form
  clearCreateChannel(): void {
    this.channelName = '';
    this.channelDescription = '';
  }

  // Edit an existing channel
  editChannel(channel: any): void {
    this.editChannelData = { ...channel }; // Copy channel data for editing
    this.isEditChannelMode = true;
  }

  // Save the edited channel details
  saveChannel(): void {
    if (!this.editChannelData.name || !this.editChannelData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    this.channelService
      .updateChannel(this.editChannelData._id, this.editChannelData)
      .subscribe(
        (updatedChannel) => {
          // Update the channel in the list
          const index = this.channels.findIndex(
            (ch) => ch._id === updatedChannel._id
          );
          if (index !== -1) {
            this.channels[index] = updatedChannel;
          }
          this.cancelEdit(); // Exit channel edit mode
          alert('Channel updated successfully!');
        },
        (error) => {
          console.error('Error updating channel:', error);
          alert('Failed to update channel.');
        }
      );
  }

  // Delete a channel from the group
  deleteChannel(channelId: string): void {
    if (confirm('Are you sure you want to delete this channel?')) {
      this.channelService.deleteChannel(channelId).subscribe(
        () => {
          this.channels = this.channels.filter(
            (channel) => channel._id !== channelId
          );
          alert('Channel deleted successfully!');
        },
        (error) => {
          console.error('Error deleting channel:', error);
          alert('Failed to delete channel.');
        }
      );
    }
  }

  // Cancel editing a channel
  cancelEdit(): void {
    this.editChannelData = null;
    this.isEditChannelMode = false;
  }

  // Remove a user from the group
  removeUserFromGroup(userId: string): void {
    if (this.group) {
      this.groupService.removeUserFromGroup(this.group._id, userId).subscribe(
        () => {
          // Update member and interested users lists
          this.activeMembers = this.activeMembers.filter(
            (user) => user._id !== userId
          );
          this.interestedUsers = this.interestedUsers.filter(
            (user) => user._id !== userId
          );
          alert('User removed from group successfully.');
        },
        (error) => {
          console.error('Error removing user from group:', error);
          alert('Failed to remove user from group.');
        }
      );
    }
  }

  // Allow a user to join the group from interested users
  allowUserToJoin(userId: string): void {
    if (this.group) {
      this.groupService.allowUserToJoin(this.group._id, userId).subscribe(
        () => {
          // Move user from interestedUsers to activeMembers
          const user = this.interestedUsers.find((user) => user._id === userId);
          if (user) {
            this.activeMembers.push(user);
            this.interestedUsers = this.interestedUsers.filter(
              (u) => u._id !== userId
            );
          }
          alert('User allowed to join group successfully.');
        },
        (error) => {
          console.error('Error allowing user to join group:', error);
          alert('Failed to allow user to join group.');
        }
      );
    }
  }

  // Profile Image Select
  onFileSelected(event: any) {
    this.selectedfile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedfile && this.group) {
      const fd = new FormData();
      fd.append('image', this.selectedfile, this.selectedfile.name);

      const groupId = this.group._id;

      this.groupService.imgupload(groupId, fd).subscribe(
        (res: any) => {
          // Check if the result is OK and the image URL is returned
          if (res && res.result === 'OK' && res.data && res.data.url) {
            // Update group image path with the new image URL
            this.group.groupImg = res.data.url;
            console.log('Image updated successfully with URL:', res.data.url);
          } else {
            console.error('Unexpected response format:', res);
          }
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    } else {
      console.error('No file selected or group data is missing!');
    }
  }
}
