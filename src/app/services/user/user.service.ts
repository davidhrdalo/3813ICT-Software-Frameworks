import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
  private allUsersSubject = new BehaviorSubject<any[]>([]); // BehaviorSubject to track all users
  allUsers$ = this.allUsersSubject.asObservable(); // Expose the users as an observable

  constructor(private httpClient: HttpClient) {
    this.loadAllUsers(); // Load all users when the service is initialized
  }

  // Fetch all users from the backend and filter out the active user
  private loadAllUsers(): void {
    this.httpClient
      .get<any[]>(BACKEND_URL, httpOptions) // Make GET request to fetch users
      .pipe(
        tap((users: any[]) => {
          if (users) {
            // Filter out the active user and update the BehaviorSubject
            this.allUsersSubject.next(
              users.filter((user) => !this.isActiveUser(user))
            );
          }
        }),
        catchError(this.handleError('Failed to load users'))
      )
      .subscribe(); // Execute the request
  }

  // Create a new user by sending a POST request to the backend
  createUser(
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.httpClient
      .post(`${BACKEND_URL}/create`, { username, email, password }, httpOptions)
      .pipe(
        tap((newUser) => {
          // Update the local list of users with the newly created user
          const currentUsers = this.allUsersSubject.value;
          this.allUsersSubject.next([...currentUsers, newUser]);
        }),
        catchError(this.handleError('Failed to create user'))
      );
  }

  // Check if the given user is the active (currently logged-in) user
  private isActiveUser(user: any): boolean {
    const activeUsername = sessionStorage.getItem('username'); // Get active username from session storage
    return user.username === activeUsername; // Compare the user's username with the active username
  }

  // Manually update the user list, ensuring the active user is excluded
  updateUsers(users: any[]): void {
    this.allUsersSubject.next(users.filter((user) => !this.isActiveUser(user))); // Update user list
  }

  // Get the current value of the users BehaviorSubject
  getUsers(): any[] {
    return this.allUsersSubject.value; // Return the current list of users
  }

  // Delete a user by sending a DELETE request to the backend
  deleteUser(userId: string): Observable<any> {
    return this.httpClient.delete(`${BACKEND_URL}/${userId}`, httpOptions).pipe(
      tap(() => {
        // Update the user list locally by removing the deleted user
        const currentUsers = this.allUsersSubject.value;
        this.allUsersSubject.next(
          currentUsers.filter((user) => user._id !== userId)
        );
      }),
      catchError(this.handleError('Failed to delete user'))
    );
  }

  // Promote a user to Group Admin by sending a POST request to the backend
  promoteToGroupAdmin(userId: string): Observable<any> {
    return this.httpClient
      .post(`${BACKEND_URL}/${userId}/promote/group`, {}, httpOptions)
      .pipe(
        tap((updatedUser) => {
          // Update the user list locally with the updated user role
          const currentUsers = this.allUsersSubject.value.map((user) =>
            user._id === userId ? updatedUser : user
          );
          this.allUsersSubject.next(currentUsers); // Update the user list in the BehaviorSubject
        }),
        catchError(this.handleError('Failed to promote user to Group Admin'))
      );
  }

  // Promote a user to Super Admin by sending a POST request to the backend
  promoteToSuperAdmin(userId: string): Observable<any> {
    return this.httpClient
      .post(`${BACKEND_URL}/${userId}/promote/super`, {}, httpOptions)
      .pipe(
        tap((updatedUser) => {
          // Update the user list locally with the updated user role
          const currentUsers = this.allUsersSubject.value.map((user) =>
            user._id === userId ? updatedUser : user
          );
          this.allUsersSubject.next(currentUsers); // Update the user list in the BehaviorSubject
        }),
        catchError(this.handleError('Failed to promote user to Super Admin'))
      );
  }

  // Handle user profile images
  imgupload(userId: string, fd: any) {
    return this.httpClient.post<any>(`${BACKEND_URL}/${userId}/upload`, fd).pipe(
      catchError(this.handleError('Failed to upload user image'))
    );
  }

  // Error handling method
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = `${operation} failed: `;
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage += `${error.error.message}`;
      } else {
        // Backend error
        switch (error.status) {
          case 400:
            errorMessage += `Bad Request - ${error.error.message || 'Invalid input'}`;
            break;
          case 401:
            errorMessage += 'Unauthorized - Please log in again.';
            break;
          case 403:
            errorMessage += 'Forbidden - You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage += 'Not Found - The requested resource does not exist.';
            break;
          case 409:
            errorMessage += `Conflict - ${error.error.message || 'Resource already exists'}`;
            break;
          case 500:
            errorMessage += 'Server Error - Please try again later.';
            break;
          default:
            errorMessage += `Unknown Error - ${error.error.message || 'An unexpected error occurred'}`;
        }
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    };
  }
}