import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { GroupService } from '../services/group/group.service'; // Adjust the import path as needed

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentRoute: string = '';
  userGroups: any[] = [];
  adminGroups: any[] = [];
  memberOnlyGroups: any[] = [];

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      this.currentRoute = route.snapshot.url[0]?.path || '';
    });
  }
  
  ngOnInit() {
    this.getActiveUserGroups();
    this.getAdminGroups();
    this.getMemberOnlyGroups();
  }

  getActiveUserGroups() {
    this.groupService.getGroupsActiveUserIsMemberOf().subscribe(
      (groups) => {
        this.userGroups = groups;
      },
      (error) => {
        console.error('Error fetching user groups:', error);
      }
    );
  }

  getAdminGroups() {
    this.groupService.getGroupsActiveUserIsAdminOf().subscribe(
      (groups) => {
        this.adminGroups = groups;
      },
      (error) => {
        console.error('Error fetching admin groups:', error);
      }
    );
  }

  getMemberOnlyGroups() {
    this.groupService.getGroupsActiveUserIsMemberButNotAdminOf().subscribe(
      (groups) => {
        this.memberOnlyGroups = groups;
      },
      (error) => {
        console.error('Error fetching member-only groups:', error);
      }
    );
  }
}