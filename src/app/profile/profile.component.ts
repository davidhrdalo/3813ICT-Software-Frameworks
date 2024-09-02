import { Component, OnInit } from '@angular/core';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { GroupService } from '../services/group/group.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userData: any;
  userEditData: any;
  currentRole: string = '';
  isEditMode: boolean = false;
  allUsers: any;
  adminGroups: any[] = [];
  memberOnlyGroups: any[] = [];
  notInGroups: any[] = [];
  groupName: string = '';
  groupDescription: string = '';
  username: string = '';
  password: string = '';

  constructor(
    private activeUserService: ActiveUserService, 
    private userService: UserService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getAllUsers();
    this.getAdminGroups();
    this.getMemberOnlyGroups();
    this.getGUserNotInGroups();
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.userEditData = null; // Clear edit data when exiting edit mode
    } else {
      this.userEditData = { ...this.userData }; // Create a copy of the user data for editing
    }
    this.isEditMode = !this.isEditMode;
  }

  saveDetails(): void {
    this.activeUserService.updateUserData(this.userEditData);
    this.userData = { ...this.userEditData }; // Update the original data after saving
    this.toggleEditMode(); // Exit edit mode after saving
    alert('Profile updated successfully!');
  }

  getAllUsers(): void {
    this.userService.allUsers$.subscribe(users => {
      this.allUsers = users;
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          alert('User deleted successfully!');
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user.');
        }
      );
    }
  }

  getAdminGroups() {
    this.groupService.getGroupsActiveUserIsAdminOf().subscribe(
      (groups) => {
        this.adminGroups = groups;
      },
      (error) => {
        console.error('Error fetching admin groups:', error);
      }
    );
  }

  getMemberOnlyGroups() {
    this.groupService.getGroupsActiveUserIsMemberButNotAdminOf().subscribe(
      (groups) => {
        this.memberOnlyGroups = groups;
      },
      (error) => {
        console.error('Error fetching member-only groups:', error);
      }
    );
  }

  getGUserNotInGroups() {
    this.groupService.getGroupsUserIsNotIn().subscribe(
      (groups) => {
        this.notInGroups = groups;
      },
      (error) => {
        console.error('Error fetching not in groups:', error);
      }
    );
  }

  createGroup(): void {
    if (!this.groupName || !this.groupDescription) {
      alert('Please provide both a group name and description.');
      return;
    }

    this.groupService.createGroup(this.groupName, this.groupDescription).subscribe(
      (response) => {
        alert('Group created successfully!');
        this.getAdminGroups(); // Refresh the admin groups list
        this.groupName = '';
        this.groupDescription = '';
      },
      (error) => {
        console.error('Error creating group:', error);
        alert('Failed to create group.');
      }
    );
  }

  deleteGroup(groupId: number): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe(
        () => {
          alert('Group deleted successfully!');
          this.getAdminGroups(); // Refresh the admin groups list
        },
        (error) => {
          console.error('Error deleting group:', error);
          alert('Failed to delete group.');
        }
      );
    }
  }

  markInterest(group: any): void {
    const userId = this.userData.id;
  
    if (group.interested.includes(userId)) {
      // Unregister interest
      this.groupService.removeInterestFromGroup(group.id, userId).subscribe(
        () => {
          alert('You have unregistered your interest in this group.');
          this.getGUserNotInGroups(); // Refresh the list of groups the user is not in
        },
        (error) => {
          console.error('Error unregistering interest in group:', error);
          alert('Failed to unregister interest.');
        }
      );
    } else {
      // Register interest
      this.groupService.addInterestToGroup(group.id, userId).subscribe(
        () => {
          alert('You have registered your interest in this group.');
          this.getGUserNotInGroups(); // Refresh the list of groups the user is not in
        },
        (error) => {
          console.error('Error registering interest in group:', error);
          alert('Failed to register interest.');
        }
      );
    }
  }

  createUser(): void {
    if (!this.username || !this.password) {
      alert('Please fill in all required fields.');
      return;
    }

    this.userService.createUser(this.username, this.password).subscribe(
      () => {
        alert('User created successfully!');
        this.clearCreateUser(); // Clear input fields after creation
      },
      (error) => {
        console.error('Error creating user:', error);
        alert('Failed to create user.');
      }
    );
  }

  clearCreateUser(): void {
    this.username = '';
    this.password = '';
  }
  
}
