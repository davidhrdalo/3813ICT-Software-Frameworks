import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
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
    return this.http.get<any[]>(BACKEND_URL).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch channels that belong to a specific group by filtering the list of all channels
  getChannelsByGroupId(groupId: string): Observable<any[]> {
    return this.getChannels().pipe(
      map(
        (channels) => channels.filter((channel) => channel.groupId === groupId) // Filter channels by group ID
      ),
      catchError(this.handleError)
    );
  }

  // Create a new channel by sending channel data to the backend API
  createChannel(channelData: any): Observable<any> {
    return this.http.post(BACKEND_URL, channelData, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a channel by its ID
  deleteChannel(channelId: string): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/${channelId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Update a channel by sending updated channel data to the backend API
  updateChannel(channelId: string, channelData: any): Observable<any> {
    return this.http.put(
      `${BACKEND_URL}/${channelId}`,
      channelData,
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Add a user as a member to a specific channel
  addMember(channelId: string, userId: string): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${channelId}/addMember`,
      { userId }, // Send user ID in the request body
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Remove a user from a channel by sending the user ID to the backend
  removeMember(channelId: string, userId: string): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${channelId}/removeMember`,
      { userId }, // Send user ID in the request body
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get all members of a channel, excluding the current logged-in user
  getChannelMembers(channelId: string): Observable<any[]> {
    return this.getChannels().pipe(
      map((channels) => {
        const channel = channels.find((c) => c._id === channelId); // Find the channel by ID
        if (channel) {
          const currentUser = this.activeUserService.getUserData(); // Get current logged-in user
          return this.filterUsersByIds(channel.members).filter(
            (user) => user._id !== currentUser._id // Exclude the current user from the list
          );
        } else {
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get users who are members of the group but not part of a specific channel
  getNonChannelMembers(channelId: string, groupId: string): Observable<any[]> {
    return this.groupService.getActiveMembers(groupId).pipe(
      switchMap((groupMembers) =>
        this.getChannels().pipe(
          map((channels) => {
            const channel = channels.find((c) => c._id === channelId); // Find the channel by ID
            const channelMemberIds = channel ? channel.members : []; // Get member IDs in the channel
            // Return users who are in the group but not in the channel
            return groupMembers.filter(
              (member) => !channelMemberIds.includes(member._id)
            );
          })
        )
      ),
      catchError(this.handleError)
    );
  }

  // Helper function to filter all users by their IDs
  private filterUsersByIds(userIds: string[]): any[] {
    const allUsers = this.userService.getUsers(); // Assuming this gets all users from UserService
    return allUsers.filter((user) => userIds.includes(user._id)); // Filter users by matching IDs
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request: ${error.error.message || 'Invalid input'}`;
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again.';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource does not exist.';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error.message || 'Unknown error'}`;
      }
    }
    console.error('Channel operation failed:', errorMessage);
    return throwError(errorMessage);
  }
}