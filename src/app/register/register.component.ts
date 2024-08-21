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
