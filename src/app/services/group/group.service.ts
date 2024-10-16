import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ActiveUserService } from '../activeUser/activeUser.service';
import { UserService } from '../user/user.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BACKEND_URL = 'http://localhost:3000/api/groups';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(
    private http: HttpClient,
    private activeUserService: ActiveUserService,
    private userService: UserService
  ) {}

  // Fetch all groups from the backend API
  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL).pipe(
      catchError(this.handleError)
    );
  }

  // Get all groups (this is the same as getGroups, could be extended for future use)
  getAllGroups(): Observable<any[]> {
    return this.getGroups();
  }

  // Fetch groups where the currently logged-in user is a member
  getGroupsActiveUserIsMemberOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData(); // Get logged-in user data
    if (!userData) {
      // Return an empty array if no user data is available
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = userData._id;
    // Filter groups where the user is listed as a member
    return this.getGroups().pipe(
      map((groups) => groups.filter((group) => group.members.includes(userId)))
    );
  }

  // Fetch groups where the currently logged-in user is an admin
  getGroupsActiveUserIsAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData(); // Get logged-in user data
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = userData._id;
    // Filter groups where the user is listed as an admin
    return this.getGroups().pipe(
      map((groups) => groups.filter((group) => group.admins.includes(userId)))
    );
  }

  // Fetch groups where the user is a member but not an admin
  getGroupsActiveUserIsMemberButNotAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = userData._id;
    // Filter groups where the user is a member but not an admin
    return this.getGroups().pipe(
      map((groups) =>
        groups.filter(
          (group) =>
            group.members.includes(userId) && !group.admins.includes(userId)
        )
      )
    );
  }

  // Fetch groups the user is not involved with (neither a member nor an admin)
  getGroupsUserIsNotIn(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = userData._id;
    // Filter out groups where the user is neither a member nor an admin
    return this.getGroups().pipe(
      map((groups) =>
        groups.filter(
          (group) =>
            !group.members.includes(userId) && !group.admins.includes(userId)
        )
      )
    );
  }

  // Fetch active members of a group, excluding the current logged-in user
  getActiveMembers(groupId: string): Observable<any[]> {
    const currentUser = this.activeUserService.getUserData(); // Get the current logged-in user
    return this.getGroups().pipe(
      map((groups) => {
        const group = groups.find((g) => g._id === groupId); // Find the group by its ID
        if (group) {
          // Filter out the current user from the group members list
          return this.filterUsersByIds(group.members).filter(
            (user) => user._id !== currentUser._id
          );
        } else {
          return [];
        }
      })
    );
  }

  // Fetch users who have expressed interest in a group
  getInterestedUsers(groupId: string): Observable<any[]> {
    return this.getGroups().pipe(
      map((groups) => {
        const group = groups.find((g) => g._id === groupId); // Find the group by its ID
        if (group) {
          // Get users who are interested in the group
          return this.filterUsersByIds(group.interested);
        } else {
          return [];
        }
      })
    );
  }

  // Utility function to filter users by their IDs (assumes userService.getUsers() returns all users)
  private filterUsersByIds(userIds: string[]): any[] {
    const allUsers = this.userService.getUsers(); // Fetch all users from UserService
    return allUsers.filter((user) => userIds.includes(user._id)); // Filter users by matching IDs
  }

  // Create a new group with the active user as the admin
  createGroup(groupName: string, groupDescription: string): Observable<any> {
    const userData = this.activeUserService.getUserData(); // Get logged-in user data
    if (!userData) {
      // If the user is not logged in, return an error
      return new Observable((subscriber) =>
        subscriber.error('User not logged in')
      );
    }

    // Create a new group object with the current user as the admin
    const newGroup = {
      name: groupName,
      description: groupDescription,
      admins: [userData._id], // Set the active user as the admin
      members: [],
      interested: [],
      groupImg: 'assets/images/defaultGroup.jpg', // Default group image
    };

    // Send the new group data to the backend
    return this.http.post(BACKEND_URL, newGroup, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a group by its ID
  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/${groupId}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing group by sending the updated data to the backend
  updateGroup(groupId: string, updatedGroupData: any): Observable<any> {
    return this.http.put(
      `${BACKEND_URL}/${groupId}`,
      updatedGroupData,
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Add a user to a group's interested list
  addInterestToGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/interested`,
      { userId }, // Send user ID in the request body
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Remove a user's interest from a group
  removeInterestFromGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/unregister-interest`,
      { userId }, // Send user ID in the request body
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Remove a user from a group
  removeUserFromGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/removeUser`,
      { userId }, // Send user ID in the request body
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Allow a user to join a group
  allowUserToJoin(groupId: string, userId: string): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/allowUserToJoin`,
      { userId }, // Send user ID in the request body
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }
  
  // Handle group profile images
  imgupload(groupId: string, fd: any) {
    return this.http.post<any>(`${BACKEND_URL}/${groupId}/upload`, fd).pipe(
      catchError(this.handleError)
    );
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
          errorMessage = 'Not Found: The requested group does not exist.';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error.message || 'Unknown error'}`;
      }
    }
    console.error('Group operation failed:', errorMessage);
    return throwError(errorMessage);
  }
}