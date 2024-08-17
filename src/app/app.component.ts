import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterLink } from '@angular/router';
import { ActiveUserService } from './services/activeUser/activeUser.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  userData: any;

  constructor(private router: Router, public activeUserService: ActiveUserService) {}

  title = 'Yapper';

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userData = this.activeUserService.getUserData();
  }

}
