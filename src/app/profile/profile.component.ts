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
  currentRole: string = '';
  isEditMode: boolean = false;

  constructor(private activeUserService: ActiveUserService) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.setCurrentRole();
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  setCurrentRole(): void {
    if (this.userData.role==='super') {
      this.currentRole = 'super';
    } else if (this.userData.role==='group') {
      this.currentRole = 'group';
    } else if (this.userData.role==='chat') {
      this.currentRole = 'chat';
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveDetails(): void {
    this.activeUserService.updateUserData(this.userData);
    this.toggleEditMode(); // Exit edit mode after saving
    alert('Profile updated successfully!');
  }
}
