import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Ensure HttpClientModule is imported here
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService] // Ensure UserService is provided here if not globally available
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private userService: UserService) {}

  loginSubmitted() {
    this.userService.login(this.username, this.password)
      .subscribe((data: any) => {
        if (data) {
          // Navigate to the account page after successful login
          this.router.navigateByUrl("/profile");
        } else {
          alert("Invalid username or password");
        }
      }, error => {
        alert("An error occurred during login. Please try again.");
      });
  }
}
