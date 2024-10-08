import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActiveUserService } from '../services/activeUser/activeUser.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = ''; // Model to hold username input
  password = ''; // Model to hold password input
  errorMessage = ''; // New property to hold error messages

  constructor(
    private router: Router,
    private activeUserService: ActiveUserService
  ) {}

  // Function called when the login form is submitted
  loginSubmitted() {
    // Call the login function from ActiveUserService, passing the username and password
    this.activeUserService.login(this.username, this.password).subscribe(
      (data: any) => {
        if (data) {
          // Navigate to the profile page if login is successful
          this.router.navigateByUrl('/profile');
        } else {
          // Show an error message if login credentials are invalid
          this.errorMessage = 'Invalid username or password';
        }
      },
      (error: string) => {
        // Handle any errors that occur during the login process
        this.errorMessage = error;
      }
    );
  }
}