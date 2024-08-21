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
