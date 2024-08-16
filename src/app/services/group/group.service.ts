import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActiveUserService } from '../activeUser/activeUser.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const BACKEND_URL = 'http://localhost:3000/api/groups';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private http: HttpClient,
    private activeUserService: ActiveUserService
  ) { }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL);
  }

  getGroupsActiveUserIsMemberOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      // Return an empty array if there's no user data
      return new Observable(subscriber => subscriber.next([]));
    }
    const userId = userData.id;
    return this.getGroups().pipe(
      map(groups => groups.filter(group => group.members.includes(Number(userId))))
    );
  }

  getGroupsActiveUserIsAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable(subscriber => subscriber.next([]));
    }
    const userId = Number(userData.id);
    return this.getGroups().pipe(
      map(groups => groups.filter(group => group.admins.includes(userId)))
    );
  }

  getGroupsActiveUserIsMemberButNotAdminOf(): Observable<any[]> {
    const userData = this.activeUserService.getUserData();
    if (!userData) {
      return new Observable(subscriber => subscriber.next([]));
    }
    const userId = Number(userData.id);
    return this.getGroups().pipe(
      map(groups => groups.filter(group => 
        group.members.includes(userId) && !group.admins.includes(userId)
      ))
    );
  }
}