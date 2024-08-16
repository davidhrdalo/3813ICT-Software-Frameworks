import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ActiveUserService } from '../services/activeUser/activeUser.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [ActiveUserService]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private activeUserService: ActiveUserService) {}

  loginSubmitted() {
    this.activeUserService.login(this.username, this.password)
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
