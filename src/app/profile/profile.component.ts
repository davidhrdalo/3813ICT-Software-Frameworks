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

  // New error properties
  profileError: string = '';
  userManagementError: string = '';
  groupManagementError: string = '';
  createUserError: string = '';
  createGroupError: string = '';
  interestError: string = '';

  // New popup message property
  popupMessage: { type: 'success' | 'error', message: string } | null = null;

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
    this.showPopup('success', 'Profile updated successfully!');
  }

  // Fetch all users
  getAllUsers(): void {
    this.userService.allUsers$.subscribe((users) => {
      this.allUsers = users;
    },
    (error) => {
      this.userManagementError = 'Error fetching users. Please try again.';
      console.error('Error fetching users:', error);
    });
  }

  // Delete a user by ID
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.showPopup('success', 'User deleted successfully!');
          this.getAllUsers(); // Refresh user list
        },
        (error) => {
          this.userManagementError = 'Error deleting user. Please try again.';
          console.error('Error deleting user:', error);
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
        this.groupManagementError = 'Error fetching all groups. Please try again.';
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
        this.groupManagementError = 'Error fetching admin groups. Please try again.';
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
        this.groupManagementError = 'Error fetching member-only groups. Please try again.';
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
        this.groupManagementError = 'Error fetching groups you\'re not in. Please try again.';
        console.error('Error fetching not in groups:', error);
      }
    );
  }

  // Create a new group
  createGroup(): void {
    if (!this.groupName || !this.groupDescription) {
      this.createGroupError = 'Please provide both a group name and description.';
      return;
    }

    this.groupService
      .createGroup(this.groupName, this.groupDescription)
      .subscribe(
        () => {
          this.showPopup('success', 'Group created successfully!');
          this.getAdminGroups(); // Refresh admin groups
          this.getAllGroups(); // Refresh all groups
          this.clearCreateGroupInputs(); // Clear input fields
        },
        (error) => {
          this.createGroupError = 'Error creating group. Please try again.';
          console.error('Error creating group:', error);
        }
      );
  }

  // Clear inputs after creating a group
  clearCreateGroupInputs(): void {
    this.groupName = '';
    this.groupDescription = '';
    this.createGroupError = '';
  }

  // Delete a group by ID
  deleteGroup(groupId: string): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(groupId).subscribe(
        () => {
          this.showPopup('success', 'Group deleted successfully!');
          this.getAdminGroups(); // Refresh admin groups
          this.getAllGroups(); // Refresh all groups
        },
        (error) => {
          this.groupManagementError = 'Error deleting group. Please try again.';
          console.error('Error deleting group:', error);
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
          this.showPopup('success', 'You have unregistered your interest in this group.');
          this.getGUserNotInGroups(); // Refresh groups the user is not in
        },
        (error) => {
          this.interestError = 'Error unregistering interest. Please try again.';
          console.error('Error unregistering interest:', error);
        }
      );
    } else {
      // Register interest
      this.groupService.addInterestToGroup(group._id, userId).subscribe(
        () => {
          this.showPopup('success', 'You have registered your interest in this group.');
          this.getGUserNotInGroups(); // Refresh groups the user is not in
        },
        (error) => {
          this.interestError = 'Error registering interest in group. Please try again.';
          console.error('Error registering interest in group:', error);
        }
      );
    }
  }

  // Create a new user
  createUser(): void {
    if (!this.username || !this.email || !this.password) {
      this.createUserError = 'Please fill in all required fields.';
      return;
    }

    this.userService
      .createUser(this.username, this.email, this.password)
      .subscribe(
        () => {
          this.showPopup('success', 'User created successfully!');
          this.clearCreateUser(); // Clear input fields
          this.getAllUsers(); // Refresh user list
        },
        (error) => {
          this.createUserError = 'Error creating user. Please try again.';
          console.error('Error creating user:', error);
        }
      );
  }

  // Clear inputs after creating a user
  clearCreateUser(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.createUserError = '';
  }

  // Promote a user to Group Admin
  promoteToGroupAdmin(userId: string): void {
    if (confirm('Are you sure you want to promote this user to Group Admin?')) {
      this.userService.promoteToGroupAdmin(userId).subscribe(
        () => {
          this.showPopup('success', 'User promoted to Group Admin successfully!');
          this.getAllUsers(); // Refresh user list after promotion
        },
        (error) => {
          this.userManagementError = 'Error promoting user to Group Admin. Please try again.';
          console.error('Error promoting user to Group Admin:', error);
        }
      );
    }
  }

  // Promote a user to Super Admin
  promoteToSuperAdmin(userId: string): void {
    if (confirm('Are you sure you want to promote this user to Super Admin?')) {
      this.userService.promoteToSuperAdmin(userId).subscribe(
        () => {
          this.showPopup('success', 'User promoted to Super Admin successfully!');
          this.getAllUsers(); // Refresh user list after promotion
        },
        (error) => {
          this.userManagementError = 'Error promoting user to Super Admin. Please try again.';
          console.error('Error promoting user to Super Admin:', error);
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

      this.userService.imgupload(userId, fd).subscribe(
        (res) => {
          if (res && res.data.filename) {
            this.imagepath = res.data.filename;

            // Update the userData.profileImg with the new image path
            this.userData.profileImg = `http://localhost:3000/data/images/profileImages/${this.imagepath}`;

            // Update the user data in the ActiveUserService
            this.activeUserService.updateUserData(this.userData);
            this.showPopup('success', 'Profile image updated successfully!');
          }
        },
        (error) => {
          this.profileError = 'Error uploading image. Please try again.';
          console.error('Error uploading image:', error);
        }
      );
    } else {
      this.profileError = 'No file selected or user data is missing.';
    }
  }

  // New method to show popup
  showPopup(type: 'success' | 'error', message: string): void {
    this.popupMessage = { type, message };
    setTimeout(() => {
      this.popupMessage = null;
    }, 3000);
  }

  // Error handling method (kept for backward compatibility)
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.showPopup('error', message + '. Please try again.');
  }
}