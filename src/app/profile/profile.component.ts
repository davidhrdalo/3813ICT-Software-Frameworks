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
  userData: any; // Current user's data
  userEditData: any; // Editable copy of user data
  isEditMode: boolean = false; // Toggle for edit mode
  allUsers: any; // All users in the system
  allGroups: any[] = []; // All available groups
  adminGroups: any[] = []; // Groups where the user is an admin
  memberOnlyGroups: any[] = []; // Groups where the user is a member but not an admin
  notInGroups: any[] = []; // Groups the user is not a part of
  groupName: string = ''; // For creating a new group
  groupDescription: string = ''; // For creating a new group
  username: string = ''; // For creating a new user
  email: string = ''; // For creating a new user
  password: string = ''; // For creating a new user

  // Upload img
  selectedfile: any = null;
  imagepath = '';

  constructor(
    private activeUserService: ActiveUserService,
    private userService: UserService,
    private groupService: GroupService
  ) {}

  // Lifecycle hook: initialize component data
  ngOnInit(): void {
    this.getUserProfile(); // Load current user's profile
    this.getAllUsers(); // Load all users
    this.getAllGroups(); // Load all available groups
    this.getAdminGroups(); // Load groups where the user is an admin
    this.getMemberOnlyGroups(); // Load groups where the user is only a member
    this.getGUserNotInGroups(); // Load groups the user is not part of
  }

  // Fetch current user profile data
  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  // Toggle edit mode for profile
  toggleEditMode(): void {
    if (this.isEditMode) {
      this.userEditData = null; // Clear edit data when exiting edit mode
    } else {
      this.userEditData = { ...this.userData }; // Create a copy for editing
    }
    this.isEditMode = !this.isEditMode;
  }

  // Save profile changes and exit edit mode
  saveDetails(): void {
    this.activeUserService.updateUserData(this.userEditData);
    this.userData = { ...this.userEditData }; // Update user data after saving
    this.toggleEditMode(); // Exit edit mode
    alert('Profile updated successfully!');
  }

  // Fetch all users
  getAllUsers(): void {
    this.userService.allUsers$.subscribe((users) => {
      this.allUsers = users;
    });
  }

  // Delete a user by ID
  deleteUser(userId: string): void {
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

  // Fetch all groups in the system
  getAllGroups() {
    this.groupService.getAllGroups().subscribe(
      (groups) => {
        this.allGroups = groups;
      },
      (error) => {
        console.error('Error fetching all groups:', error);
      }
    );
  }

  // Fetch groups where the user is an admin
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

  // Fetch groups where the user is a member but not an admin
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

  // Fetch groups the user is not part of
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

  // Create a new group
  createGroup(): void {
    if (!this.groupName || !this.groupDescription) {
      alert('Please provide both a group name and description.');
      return;
    }

    this.groupService
      .createGroup(this.groupName, this.groupDescription)
      .subscribe(
        () => {
          alert('Group created successfully!');
          this.getAdminGroups(); // Refresh admin groups
          this.getAllGroups(); // Refresh all groups
          this.clearCreateGroupInputs(); // Clear input fields
        },
        (error) => {
          console.error('Error creating group:', error);
          alert('Failed to create group.');
        }
      );
  }

  // Clear inputs after creating a group
  clearCreateGroupInputs(): void {
    this.groupName = '';
    this.groupDescription = '';
  }

  // Delete a group by ID
  deleteGroup(groupId: string): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe(
        () => {
          alert('Group deleted successfully!');
          this.getAdminGroups(); // Refresh admin groups
          this.getAllGroups(); // Refresh all groups
        },
        (error) => {
          console.error('Error deleting group:', error);
          alert('Failed to delete group.');
        }
      );
    }
  }

  // Register or unregister interest in a group
  markInterest(group: any): void {
    const userId = this.userData._id;

    if (group.interested.includes(userId)) {
      // Unregister interest
      this.groupService.removeInterestFromGroup(group._id, userId).subscribe(
        () => {
          alert('You have unregistered your interest in this group.');
          this.getGUserNotInGroups(); // Refresh groups the user is not in
        },
        (error) => {
          console.error('Error unregistering interest:', error);
          alert('Failed to unregister interest.');
        }
      );
    } else {
      // Register interest
      this.groupService.addInterestToGroup(group._id, userId).subscribe(
        () => {
          alert('You have registered your interest in this group.');
          this.getGUserNotInGroups(); // Refresh groups the user is not in
        },
        (error) => {
          console.error('Error registering interest in group:', error);
          alert('Failed to register interest.');
        }
      );
    }
  }

  // Create a new user
  createUser(): void {
    if (!this.username || !this.email || !this.password) {
      alert('Please fill in all required fields.');
      return;
    }

    this.userService
      .createUser(this.username, this.email, this.password)
      .subscribe(
        () => {
          alert('User created successfully!');
          this.clearCreateUser(); // Clear input fields
        },
        (error) => {
          console.error('Error creating user:', error);
          alert('Failed to create user.');
        }
      );
  }

  // Clear inputs after creating a user
  clearCreateUser(): void {
    this.username = '';
    this.email = '';
    this.password = '';
  }

  // Promote a user to Group Admin
  promoteToGroupAdmin(userId: string): void {
    if (confirm('Are you sure you want to promote this user to Group Admin?')) {
      this.userService.promoteToGroupAdmin(userId).subscribe(
        () => {
          alert('User promoted to Group Admin successfully!');
          this.getAllUsers(); // Refresh user list after promotion
        },
        (error) => {
          console.error('Error promoting user to Group Admin:', error);
          alert('Failed to promote user to Group Admin.');
        }
      );
    }
  }

  // Promote a user to Super Admin
  promoteToSuperAdmin(userId: string): void {
    if (confirm('Are you sure you want to promote this user to Super Admin?')) {
      this.userService.promoteToSuperAdmin(userId).subscribe(
        () => {
          alert('User promoted to Super Admin successfully!');
          this.getAllUsers(); // Refresh user list after promotion
        },
        (error) => {
          console.error('Error promoting user to Super Admin:', error);
          alert('Failed to promote user to Super Admin.');
        }
      );
    }
  }

  // Profile Image Select
  onFileSelected(event: any) {
    this.selectedfile = event.target.files[0];
  }

  // Profile Image Upload
  onUpload() {
    if (this.selectedfile && this.userData) {
      const fd = new FormData();
      fd.append('image', this.selectedfile, this.selectedfile.name);

      const userId = this.userData._id;

      this.userService.imgupload(userId, fd).subscribe((res) => {
        if (res && res.data.filename) {
          this.imagepath = res.data.filename;

          // Update the userData.profileImg with the new image path
          this.userData.profileImg = `http://localhost:3000/data/images/profileImages/${this.imagepath}`;

          // Update the user data in the ActiveUserService
          this.activeUserService.updateUserData(this.userData);
        }
      });
    } else {
      console.error('No file selected or user data is missing!');
    }
  }
}