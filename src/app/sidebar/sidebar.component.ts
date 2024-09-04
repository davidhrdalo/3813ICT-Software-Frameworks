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
  user: any; // Stores user data
  currentRoute: string = ''; // Track current route (group or channel)
  userGroups: any[] = []; // User's groups
  adminGroups: any[] = []; // Groups where the user is an admin
  memberOnlyGroups: any[] = []; // Groups where the user is only a member
  channels: any[] = []; // Channels within the current group
  groupId: number | null = null; // ID of the currently selected group

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private location: Location,
    private activeUserService: ActiveUserService
  ) {
    // Listen to route changes to determine the current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Check if the current route has group or channel parameters
        const channelId = route.snapshot.paramMap.get('channelId');
        const groupId = route.snapshot.paramMap.get('id');

        if (channelId) {
          this.currentRoute = 'channel'; // Current route is a channel
        } else if (groupId) {
          this.currentRoute = 'group'; // Current route is a group
        } else {
          this.currentRoute = route.snapshot.url[0]?.path || ''; // Other routes
        }

        // Load channels if on a group or channel route
        if (this.currentRoute === 'group' || this.currentRoute === 'channel') {
          this.groupId = parseInt(groupId || '', 10); // Parse group ID from route
          this.loadChannels(this.groupId); // Load channels for the group
        } else {
          this.channels = []; // Clear channels if not in a group or channel route
          this.groupId = null;
        }

        console.log('Current Route:', this.currentRoute); // Debugging log
      });
  }

  ngOnInit() {
    // Subscribe to active user data
    this.activeUserService.userData$.subscribe((userData) => {
      this.user = userData;
      if (userData) {
        // Fetch groups where the user is an admin or member
        this.getAdminGroups();
        this.getMemberOnlyGroups();
      }
    });
  }

  // Fetch groups where the user is an admin
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

  // Fetch groups where the user is a member but not an admin
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

  // Load channels belonging to a specific group
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

  // Navigate back to the previous page
  goBack(): void {
    this.location.back();
  }
}
