import { Component, OnInit } from '@angular/core';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [ActiveUserService] 
})
export class ProfileComponent implements OnInit {
  userData: any;

  constructor(private activeUserService: ActiveUserService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }
}
