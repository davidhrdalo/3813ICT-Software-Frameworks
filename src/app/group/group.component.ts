import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group/group.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  group: any = null;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
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
      } else {
        console.log('Group not found with ID:', id); // Debugging log
      }
    });
  }
}
