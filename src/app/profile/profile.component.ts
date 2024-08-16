import { Component, OnInit } from '@angular/core';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [ActiveUserService],
})
export class ProfileComponent implements OnInit {
  userData: any;
  currentRole: string = '';

  constructor(private activeUserService: ActiveUserService) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.setCurrentRole();
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

  setCurrentRole(): void {
    if (this.activeUserService.checkRole('Super Admin')) {
      this.currentRole = 'Super Admin';
    } else if (this.activeUserService.checkRole('Group Admin')) {
      this.currentRole = 'Group Admin';
    } else if (this.activeUserService.checkRole('Chat User')) {
      this.currentRole = 'Chat User';
    }
  }
}
