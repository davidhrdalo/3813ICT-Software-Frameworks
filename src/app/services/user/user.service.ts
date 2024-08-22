import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BACKEND_URL = 'http://localhost:3000/api/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private allUsersSubject = new BehaviorSubject<any[]>([]);
  allUsers$ = this.allUsersSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadAllUsers();
  }

  // Method to load all users from the backend
  private loadAllUsers(): void {
    this.httpClient
      .get<any[]>(BACKEND_URL, httpOptions)
      .pipe(
        tap((users: any[]) => {
          if (users) {
            this.allUsersSubject.next(
              users.filter((user) => !this.isActiveUser(user))
            );
          }
        }),
        catchError((error) => {
          console.error('Failed to load users:', error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  // Method to determine if a user is the active user
  private isActiveUser(user: any): boolean {
    const activeUsername = sessionStorage.getItem('username');
    return user.username === activeUsername;
  }

  // Method to update the list of users
  updateUsers(users: any[]): void {
    this.allUsersSubject.next(users.filter((user) => !this.isActiveUser(user)));
  }

  // Method to get the current list of users
  getUsers(): any[] {
    return this.allUsersSubject.value;
  }
}
