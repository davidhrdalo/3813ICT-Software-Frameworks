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
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor(private router: Router, private httpClient: HttpClient) {
    this.initializeUserData();
  }

  private initializeUserData(): void {
    const userData = this.getUserDataFromStorage();
    if (userData) {
      this.userDataSubject.next(userData);
    }
  }

  // Method to sign up a new user
  signup(user: any): Observable<any> {
    return this.httpClient
      .post(`${BACKEND_URL}/signup`, user, httpOptions)
      .pipe(
        tap((data: any) => {
          if (data) {
            this.setSessionStorage(data);
            this.userDataSubject.next(data); // Emit new user data immediately
          }
        }),
        catchError((error) => {
          console.error('Signup failed:', error);
          return throwError(error); // Use throwError to maintain observable chain
        })
      );
  }

  // Method to log in a user
  login(username: string, password: string): Observable<any> {
    const user = { username, password };
    return this.httpClient.post(BACKEND_URL, user, httpOptions).pipe(
      tap((data: any) => {
        if (data) {
          this.setSessionStorage(data);
          this.userDataSubject.next(data); // Emit new user data immediately
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(error); // Use throwError to maintain observable chain
      })
    );
  }

  // Method to set user data in session storage
  private setSessionStorage(userData: any): void {
    sessionStorage.setItem('id', userData.id.toString());
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('role', userData.role);
    sessionStorage.setItem('profileImg', userData.profileImg);
    sessionStorage.setItem('firstName', userData.firstName);
    sessionStorage.setItem('lastName', userData.lastName);
    sessionStorage.setItem('dob', userData.dob);
    sessionStorage.setItem('status', userData.status);
    this.userDataSubject.next(userData);
  }

  // Method to log out the user
  logout(): void {
    sessionStorage.clear();
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Method to check if a user is logged in
  isLoggedIn(): boolean {
    return sessionStorage.getItem('username') !== null;
  }

  // Method to get the current user data from session storage
  getUserData(): any {
    return this.userDataSubject.value;
  }

  private getUserDataFromStorage(): any {
    if (this.isLoggedIn()) {
      return {
        id: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('email'),
        role: sessionStorage.getItem('role'),
        profileImg: sessionStorage.getItem('profileImg'),
        firstName: sessionStorage.getItem('firstName'),
        lastName: sessionStorage.getItem('lastName'),
        dob: sessionStorage.getItem('dob'),
        status: sessionStorage.getItem('status'),
      };
    }
    return null;
  }

  // Method to update user data in session storage
  updateUserData(userData: any): void {
    sessionStorage.setItem('id', userData.id.toString());
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('role', userData.role);
    sessionStorage.setItem('profileImg', userData.profileImg);
    sessionStorage.setItem('firstName', userData.firstName);
    sessionStorage.setItem('lastName', userData.lastName);
    sessionStorage.setItem('dob', userData.dob);
    sessionStorage.setItem('status', userData.status);
    this.userDataSubject.next(userData);
  }
}
