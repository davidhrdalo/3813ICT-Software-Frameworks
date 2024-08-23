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

  registerSubmitted() {
    if (!this.firstName || !this.lastName || !this.username || !this.email || !this.password || !this.dob) {
      alert('Please fill in all required fields.');
      return;
    }

    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      dob: this.dob,
    };

    this.activeUserService.signup(user).subscribe(
      (data: any) => {
        if (data) {
          // Navigate to the profile page after successful signup
          this.router.navigateByUrl('/profile');
        } else {
          alert('Signup failed. Please try again.');
        }
      },
      (error) => {
        alert('An error occurred during signup. Please try again.');
      }
    );
  }
}
