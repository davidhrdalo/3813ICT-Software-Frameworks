import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../services/channel/channel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit {
    channel: any = null;


  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const groupId = +params.get('id')!;
      const channelId = +params.get('channelId')!;
      this.loadChannelDetails(groupId, channelId);
    });
  }

  loadChannelDetails(groupId: number, channelId: number): void {
    this.channelService.getChannelsByGroupId(groupId).subscribe(channels => {
      this.channel = channels.find(channel => channel.id === channelId);
      if (this.channel) {
        console.log('Channel details:', this.channel); // Debugging log
      } else {
        console.log('Channel not found with ID:', channelId); // Debugging log
      }
    });
  }
}