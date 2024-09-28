import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BACKEND_URL = 'http://localhost:3000/api/auth';

@Injectable({
  providedIn: 'root',
})
export class ActiveUserService {
  private userDataSubject = new BehaviorSubject<any>(null); // Observable to track user data
  userData$ = this.userDataSubject.asObservable(); // Expose user data as observable for subscribers

  constructor(private router: Router, private httpClient: HttpClient) {
    this.initializeUserData(); // Initialize user data from session storage if available
  }

  // Initialize user data by checking session storage
  private initializeUserData(): void {
    const userData = this.getUserDataFromStorage();
    if (userData) {
      this.userDataSubject.next(userData); // Emit stored user data if available
    }
  }

  // Method to sign up a new user
  signup(user: any): Observable<any> {
    return this.httpClient
      .post(`${BACKEND_URL}/signup`, user, httpOptions)
      .pipe(
        tap((data: any) => {
          if (data) {
            this.setSessionStorage(data); // Store user data in session storage
            this.userDataSubject.next(data); // Emit new user data
          }
        }),
        catchError((error) => {
          console.error('Signup failed:', error);
          return throwError(error); // Return an observable error
        })
      );
  }

  // Method to log in a user
  login(username: string, password: string): Observable<any> {
    const user = { username, password };
    return this.httpClient.post(BACKEND_URL, user, httpOptions).pipe(
      tap((data: any) => {
        if (data) {
          this.setSessionStorage(data); // Store user data in session storage
          this.userDataSubject.next(data); // Emit new user data
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(error); // Return an observable error
      })
    );
  }

  // Store user data in session storage
  private setSessionStorage(userData: any): void {
    sessionStorage.setItem('_id', userData._id);
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('roles', userData.roles);
    sessionStorage.setItem('profileImg', userData.profileImg);
    sessionStorage.setItem('firstName', userData.firstName);
    sessionStorage.setItem('lastName', userData.lastName);
    sessionStorage.setItem('dob', userData.dob);
    sessionStorage.setItem('status', userData.status);
    this.userDataSubject.next(userData); // Emit updated user data
  }

  // Method to log out the user
  logout(): void {
    sessionStorage.clear(); // Clear session storage
    this.userDataSubject.next(null); // Reset user data
    this.router.navigate(['/login']); // Navigate to login page
  }

  // Check if a user is currently logged in
  isLoggedIn(): boolean {
    return sessionStorage.getItem('username') !== null; // Check if username is in session storage
  }

  // Get the current user data from the observable
  getUserData(): any {
    return this.userDataSubject.value; // Return current user data
  }

  // Fetch user data from session storage
  private getUserDataFromStorage(): any {
    if (this.isLoggedIn()) {
      return {
        _id: sessionStorage.getItem('_id'),
        username: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('email'),
        roles: sessionStorage.getItem('roles'),
        profileImg: sessionStorage.getItem('profileImg'),
        firstName: sessionStorage.getItem('firstName'),
        lastName: sessionStorage.getItem('lastName'),
        dob: sessionStorage.getItem('dob'),
        status: sessionStorage.getItem('status'),
      };
    }
    return null;
  }

  // Update user data and store it in session storage
  updateUserData(userData: any): void {
    sessionStorage.setItem('_id', userData._id);
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('roles', userData.roles);
    sessionStorage.setItem('profileImg', userData.profileImg);
    sessionStorage.setItem('firstName', userData.firstName);
    sessionStorage.setItem('lastName', userData.lastName);
    sessionStorage.setItem('dob', userData.dob);
    sessionStorage.setItem('status', userData.status);
    this.userDataSubject.next(userData); // Emit updated user data
  }
}