import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const BACKEND_URL = 'http://localhost:3000/api/auth';

@Injectable({
  providedIn: 'root'
})
export class ActiveUserService {

  constructor(private httpClient: HttpClient) {}

  // Method to log in a user
  login(username: string, password: string): Observable<any> {
    const user = { username, password };
    return this.httpClient.post(BACKEND_URL, user, httpOptions)
      .pipe(
        tap((data: any) => {
          if (data) {
            this.setSessionStorage(data);
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return (error);
        })
      );
  }

  // Method to set user data in session storage
  private setSessionStorage(userData: any): void {
    sessionStorage.setItem('id', userData.id.toString());
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('role', userData.role);
  }

  // Method to log out the user
  logout(): void {
    sessionStorage.clear();
  }

  // Method to check if a user is logged in
  isLoggedIn(): boolean {
    return sessionStorage.getItem('username') !== null;
  }

  // Method to get the current user data from session storage
  getUserData(): any {
    if (this.isLoggedIn()) {
      return {
        id: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('email'),
        role: sessionStorage.getItem('role')
      };
    }
    return null;
  }

  checkRole(role: string): boolean {
    const user = this.getUserData();
    return user && user.role;
  }
  
}
