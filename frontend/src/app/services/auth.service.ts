import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environgment'
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/login', { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.storeUserData(response.token, response.userId, response.userRole, response.firstName);
        }
      })
    );
  }
  
  register(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/register', user).pipe(
      tap(response => {
        if (response.token) {
          this.storeUserData(response.token, response.userId, response.userRole, response.firstName);
        }
      })
    );
  }

  private storeUserData(token: string, userId: number, userRole: string, firstName: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('firstName', firstName);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }


  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }


  getFirstName(): string | null {
    return localStorage.getItem('firstName');
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }
}

