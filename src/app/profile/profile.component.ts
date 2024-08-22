import { Component, OnInit } from '@angular/core';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userData: any;
  userEditData: any;
  currentRole: string = '';
  isEditMode: boolean = false;

  constructor(private activeUserService: ActiveUserService) {}

  ngOnInit(): void {
    this.getUserProfile();
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
}
