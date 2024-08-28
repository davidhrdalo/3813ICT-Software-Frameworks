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
    this.userService.deleteUser(userId);
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
}
