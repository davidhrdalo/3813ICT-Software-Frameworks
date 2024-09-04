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

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL);
  }

  getAllGroups(): Observable<any[]> {
    return this.getGroups();
  }

  getGroupsActiveUserIsMemberOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      // Return an empty array if there's no user data
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = userData.id;
    return this.getGroups().pipe(
      map((groups) =>
        groups.filter((group) => group.members.includes(Number(userId)))
      )
    );
  }

  getGroupsActiveUserIsAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = Number(userData.id);
    return this.getGroups().pipe(
      map((groups) => groups.filter((group) => group.admins.includes(userId)))
    );
  }

  getGroupsActiveUserIsMemberButNotAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = Number(userData.id);
    return this.getGroups().pipe(
      map((groups) =>
        groups.filter(
          (group) =>
            group.members.includes(userId) && !group.admins.includes(userId)
        )
      )
    );
  }

  getGroupsUserIsNotIn(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable((subscriber) => subscriber.next([]));
    }
    const userId = Number(userData.id);
    return this.getGroups().pipe(
      map((groups) =>
        groups.filter(
          (group) =>
            !group.members.includes(userId) && !group.admins.includes(userId)
        )
      )
    );
  }

  // Get active members of a group excluding the current user
  getActiveMembers(groupId: number): Observable<any[]> {
    const currentUser = this.activeUserService.getUserData(); // Get the current logged-in user
    return this.getGroups().pipe(
      map((groups) => {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          // Filter out the current user from the active members
          return this.filterUsersByIds(group.members).filter(
            (user) => user.id !== currentUser.id
          );
        } else {
          return [];
        }
      })
    );
  }

  // Get interested users of a group
  getInterestedUsers(groupId: number): Observable<any[]> {
    return this.getGroups().pipe(
      map((groups) => {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          return this.filterUsersByIds(group.interested);
        } else {
          return [];
        }
      })
    );
  }

  // Utility function to filter users by their IDs
  private filterUsersByIds(userIds: number[]): any[] {
    const allUsers = this.userService.getUsers(); // Assuming this gets all users
    return allUsers.filter((user) => userIds.includes(user.id));
  }

  createGroup(groupName: string, groupDescription: string): Observable<any> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable((subscriber) =>
        subscriber.error('User not logged in')
      );
    }

    const newGroup = {
      id: Date.now(),
      name: groupName,
      description: groupDescription,
      admins: [userData.id],
      members: [],
      interested: [],
      groupImg: 'assets/images/defaultGroup.jpg',
    };

    return this.http.post(BACKEND_URL, newGroup, httpOptions);
  }

  deleteGroup(groupId: number): Observable<any> {
    return this.http.delete(`${BACKEND_URL}/${groupId}`, httpOptions);
  }

  updateGroup(groupId: number, updatedGroupData: any): Observable<any> {
    return this.http.put(
      `${BACKEND_URL}/${groupId}`,
      updatedGroupData,
      httpOptions
    );
  }

  addInterestToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/interested`,
      { userId },
      httpOptions
    );
  }

  removeInterestFromGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/unregister-interest`,
      { userId },
      httpOptions
    );
  }

  removeUserFromGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/removeUser`,
      { userId },
      httpOptions
    );
  }

  allowUserToJoin(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${BACKEND_URL}/${groupId}/allowUserToJoin`,
      { userId },
      httpOptions
    );
  }
}
