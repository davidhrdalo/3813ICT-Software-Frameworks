import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActiveUserService } from '../services/activeUser/activeUser.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = ''; // Model to hold username input
  password = ''; // Model to hold password input

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
          // Show an alert if login credentials are invalid
          alert('Invalid username or password');
        }
      },
      (error) => {
        // Handle any errors that occur during the login process
        alert('An error occurred during login. Please try again.');
      }
    );
  }
}
