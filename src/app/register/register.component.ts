import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActiveUserService } from '../services/activeUser/activeUser.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // Form input fields
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  dob = '';

  constructor(
    private router: Router,
    private activeUserService: ActiveUserService
  ) {}

  // Method called when the registration form is submitted
  registerSubmitted() {
    // Check if all fields are filled
    if (
      !this.firstName ||
      !this.lastName ||
      !this.username ||
      !this.email ||
      !this.password ||
      !this.dob
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create a user object from the form data
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      dob: this.dob,
    };

    // Call the signup method from ActiveUserService
    this.activeUserService.signup(user).subscribe(
      (data: any) => {
        if (data) {
          // Navigate to the profile page if signup is successful
          this.router.navigateByUrl('/profile');
        } else {
          alert('Signup failed. Please try again.');
        }
      },
      (error) => {
        // Handle any errors during signup
        alert('An error occurred during signup. Please try again.');
      }
    );
  }
}
