import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userData: any; // Holds the current user data

  constructor(public activeUserService: ActiveUserService) {} 

  title = 'Yapper'; // Title of the application

  // Initialize component
  ngOnInit(): void {
    // Subscribe to the user data observable to get updates when user data changes
    this.activeUserService.userData$.subscribe((userData) => {
      this.userData = userData; // Update the local user data
      console.log('User data updated:', userData); // Log the updated user data for debugging
    });
  }
}
