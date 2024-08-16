import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, Location } from '@angular/common';
import { GroupService } from '../services/group/group.service';
import { ChannelService } from '../services/channel/channel.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentRoute: string = '';
  userGroups: any[] = [];
  adminGroups: any[] = [];
  memberOnlyGroups: any[] = [];
  channels: any[] = [];
  groupId: number | null = null;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private location: Location
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      this.currentRoute = route.snapshot.url[0]?.path || '';

      if (this.currentRoute === 'group') {
        this.groupId = parseInt(route.snapshot.paramMap.get('id') || '', 10);
        if (this.groupId) {
          this.loadChannels(this.groupId);
        }
      } else {
        this.channels = [];
        this.groupId = null;
      }
    });
  }

  ngOnInit() {
    this.getAdminGroups();
    this.getMemberOnlyGroups();
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

  loadChannels(groupId: number) {
    this.channelService.getChannelsByGroupId(groupId).subscribe(
      (channels) => {
        this.channels = channels;
      },
      (error) => {
        console.error('Error fetching channels:', error);
      }
    );
  }

  goBack(): void {
    this.location.back(); // Navigate back
  }
}