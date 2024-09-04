import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<any[]>(BACKEND_URL);
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
    const userId = userData.id;
    // Filter groups where the user is listed as a member
    return this.getGroups().pipe(
      map((groups) =>
        groups.filter((group) => group.members.includes(Number(userId)))
      )
    );
  }

  // Fetch groups where the currently logged-in user is an admin
  getGroupsActiveUserIsAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData(); // Get logged-in user data
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = Number(userData.id); // Convert user ID to number
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
    const userId = Number(userData.id);
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
    const userId = Number(userData.id);
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
  getActiveMembers(groupId: number): Observable<any[]> {
    const currentUser = this.activeUserService.getUserData(); // Get the current logged-in user
    return this.getGroups().pipe(
      map((groups) => {
        const group = groups.find((g) => g.id === groupId); // Find the group by its ID
        if (group) {
          // Filter out the current user from the group members list
          return this.filterUsersByIds(group.members).filter(
            (user) => user.id !== currentUser.id
          );
        } else {
          return [];
        }
      })
    );
  }

  // Fetch users who have expressed interest in a group
  getInterestedUsers(groupId: number): Observable<any[]> {
    return this.getGroups().pipe(
      map((groups) => {
        const group = groups.find((g) => g.id === groupId); // Find the group by its ID
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
  private filterUsersByIds(userIds: number[]): any[] {
    const allUsers = this.userService.getUsers(); // Fetch all users from UserService
    return allUsers.filter((user) => userIds.includes(user.id)); // Filter users by matching IDs
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
      id: Date.now(), // Use current timestamp as group ID
      name: groupName,
      description: groupDescription,
      admins: [userData.id], // Set the active user as the admin
      members: [],
      interested: [],
      groupImg: 'assets/images/defaultGroup.jpg', // Default group image
    };

    // Send the new group data to the backend
    return this.http.post(BACKEND_URL, newGroup, httpOptions);
  }

  // Delete a group by its ID
  deleteGroup(groupId: number): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/${groupId}`, httpOptions);
  }

  // Update an existing group by sending the updated data to the backend
  updateGroup(groupId: number, updatedGroupData: any): Observable<any> {
    return this.http.put(
      `${BACKEND_URL}/${groupId}`,
      updatedGroupData,
      httpOptions
    );
  }

  // Add a user to a group's interested list
  addInterestToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/interested`,
      { userId }, // Send user ID in the request body
      httpOptions
    );
  }

  // Remove a user's interest from a group
  removeInterestFromGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/unregister-interest`,
      { userId }, // Send user ID in the request body
      httpOptions
    );
  }

  // Remove a user from a group
  removeUserFromGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/removeUser`,
      { userId }, // Send user ID in the request body
      httpOptions
    );
  }

  // Allow a user to join a group
  allowUserToJoin(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/allowUserToJoin`,
      { userId }, // Send user ID in the request body
      httpOptions
    );
  }
}
