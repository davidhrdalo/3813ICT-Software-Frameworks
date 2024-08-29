import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, Location } from '@angular/common';
import { GroupService } from '../services/group/group.service';
import { ChannelService } from '../services/channel/channel.service';
import { ActiveUserService } from '../services/activeUser/activeUser.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  user: any;
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
    private location: Location,
    private activeUserService: ActiveUserService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Check the route's parameter to determine if we're on a group or channel route
        const channelId = route.snapshot.paramMap.get('channelId');
        const groupId = route.snapshot.paramMap.get('id');

        if (channelId) {
          this.currentRoute = 'channel';
        } else if (groupId) {
          this.currentRoute = 'group';
        } else {
          this.currentRoute = route.snapshot.url[0]?.path || '';
        }

        // Load channels if on a group or channel route
        if (this.currentRoute === 'group' || this.currentRoute === 'channel') {
          this.groupId = parseInt(groupId || '', 10);
          this.loadChannels(this.groupId);
        } else {
          this.channels = [];
          this.groupId = null;
        }

        console.log('Current Route:', this.currentRoute); // Debugging
      });
  }

  ngOnInit() {
    this.activeUserService.userData$.subscribe(userData => {
      this.user = userData;
      if (userData) {
    this.getAdminGroups();
    this.getMemberOnlyGroups();
      }
    });
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
