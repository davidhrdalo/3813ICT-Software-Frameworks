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

  getChannels(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL);
  }

  getChannelsByGroupId(groupId: number): Observable<any[]> {
    return this.getChannels().pipe(
      map((channels) =>
        channels.filter((channel) => channel.groupId === groupId)
      )
    );
  }

  createChannel(channelData: any): Observable<any> {
    return this.http.post(BACKEND_URL, channelData, httpOptions);
  }

  deleteChannel(channelId: number): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/${channelId}`, httpOptions);
  }

  updateChannel(channelId: number, channelData: any): Observable<any> {
    return this.http.put(
      `${BACKEND_URL}/${channelId}`,
      channelData,
      httpOptions
    );
  }

  // Add a member to a channel
  addMember(channelId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${channelId}/addMember`,
      { userId },
      httpOptions
    );
  }

  // Remove a member from a channel
  removeMember(channelId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${channelId}/removeMember`,
      { userId },
      httpOptions
    );
  }

  // Get channel members excluding the current user
  getChannelMembers(channelId: number): Observable<any[]> {
    return this.getChannels().pipe(
      map((channels) => {
        const channel = channels.find((c) => c.id === channelId);
        if (channel) {
          const currentUser = this.activeUserService.getUserData();
          return this.filterUsersByIds(channel.members).filter(
            (user) => user.id !== currentUser.id
          );
        } else {
          return [];
        }
      })
    );
  }

  // Get users who are group members but not in the channel
  getNonChannelMembers(channelId: number, groupId: number): Observable<any[]> {
    return this.groupService.getActiveMembers(groupId).pipe(
      switchMap((groupMembers) =>
        this.getChannels().pipe(
          map((channels) => {
            const channel = channels.find((c) => c.id === channelId);
            const channelMemberIds = channel ? channel.members : [];
            return groupMembers.filter(
              (member) => !channelMemberIds.includes(member.id)
            );
          })
        )
      )
    );
  }

  // Utility function to filter users by their IDs
  private filterUsersByIds(userIds: number[]): any[] {
    const allUsers = this.userService.getUsers(); // Assuming this gets all users
    return allUsers.filter((user) => userIds.includes(user.id));
  }
}
