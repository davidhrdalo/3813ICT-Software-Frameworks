import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../services/group/group.service';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../services/channel/channel.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'] // Fixed from styleUrl to styleUrls
})
export class GroupComponent implements OnInit {
  group: any = null;
  channels: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService
  ) {}

  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroupDetails(parseInt(groupId, 10));
    }
  }

  loadGroupDetails(id: number): void {
    this.groupService.getGroups().subscribe(groups => {
      this.group = groups.find(group => group.id === id);
      if (this.group) {
        console.log('Group details:', this.group); // Debugging log
        this.loadChannels(this.group.id); // Load channels after group is found
      } else {
        console.log('Group not found with ID:', id); // Debugging log
      }
    });
  }

  loadChannels(groupId: number): void {
    this.channelService.getChannelsByGroupId(groupId).subscribe(channels => {
      this.channels = channels;
      console.log('Channels for group:', this.channels); // Debugging log
    });
  }
}
