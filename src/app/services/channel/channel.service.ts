import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ActiveUserService } from '../activeUser/activeUser.service';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BACKEND_URL = 'http://localhost:3000/api/channels';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(
    private http: HttpClient,
    private activeUserService: ActiveUserService,
    private userService: UserService,
    private groupService: GroupService
  ) {}

  // Fetch all channels from the backend API
  getChannels(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL);
  }

  // Fetch channels that belong to a specific group by filtering the list of all channels
  getChannelsByGroupId(groupId: number): Observable<any[]> {
    return this.getChannels().pipe(
      map(
        (channels) => channels.filter((channel) => channel.groupId === groupId) // Filter channels by group ID
      )
    );
  }

  // Create a new channel by sending channel data to the backend API
  createChannel(channelData: any): Observable<any> {
    return this.http.post(BACKEND_URL, channelData, httpOptions);
  }

  // Delete a channel by its ID
  deleteChannel(channelId: number): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/${channelId}`, httpOptions);
  }

  // Update a channel by sending updated channel data to the backend API
  updateChannel(channelId: number, channelData: any): Observable<any> {
    return this.http.put(
      `${BACKEND_URL}/${channelId}`,
      channelData,
      httpOptions
    );
  }

  // Add a user as a member to a specific channel
  addMember(channelId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${channelId}/addMember`,
      { userId }, // Send user ID in the request body
      httpOptions
    );
  }

  // Remove a user from a channel by sending the user ID to the backend
  removeMember(channelId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${channelId}/removeMember`,
      { userId }, // Send user ID in the request body
      httpOptions
    );
  }

  // Get all members of a channel, excluding the current logged-in user
  getChannelMembers(channelId: number): Observable<any[]> {
    return this.getChannels().pipe(
      map((channels) => {
        const channel = channels.find((c) => c.id === channelId); // Find the channel by ID
        if (channel) {
          const currentUser = this.activeUserService.getUserData(); // Get current logged-in user
          return this.filterUsersByIds(channel.members).filter(
            (user) => user.id !== currentUser.id // Exclude the current user from the list
          );
        } else {
          return [];
        }
      })
    );
  }

  // Get users who are members of the group but not part of a specific channel
  getNonChannelMembers(channelId: number, groupId: number): Observable<any[]> {
    return this.groupService.getActiveMembers(groupId).pipe(
      switchMap((groupMembers) =>
        this.getChannels().pipe(
          map((channels) => {
            const channel = channels.find((c) => c.id === channelId); // Find the channel by ID
            const channelMemberIds = channel ? channel.members : []; // Get member IDs in the channel
            // Return users who are in the group but not in the channel
            return groupMembers.filter(
              (member) => !channelMemberIds.includes(member.id)
            );
          })
        )
      )
    );
  }

  // Helper function to filter all users by their IDs
  private filterUsersByIds(userIds: number[]): any[] {
    const allUsers = this.userService.getUsers(); // Assuming this gets all users from UserService
    return allUsers.filter((user) => userIds.includes(user.id)); // Filter users by matching IDs
  }
}
