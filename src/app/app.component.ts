import { Component, OnInit } from '@angular/core';
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
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  userData: any;

  constructor(public activeUserService: ActiveUserService) {}

  title = 'Yapper';

  ngOnInit(): void {
    this.activeUserService.userData$.subscribe((userData) => {
      this.userData = userData;
      console.log('User data updated:', userData);
    });
  }
}
