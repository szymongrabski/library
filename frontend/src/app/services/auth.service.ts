import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environgment';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.apiUrl + '/auth/login', { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.storeUserData(
              response.token,
              response.userId,
              response.userRole,
              response.firstName
            );
          }
        })
      );
  }

  public register(user: User): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.apiUrl + '/auth/register', user)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.storeUserData(
              response.token,
              response.userId,
              response.userRole,
              response.firstName
            );
          }
        })
      );
  }

  private storeUserData(
    token: string,
    userId: number,
    userRole: string,
    firstName: string
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('firstName', firstName);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  public getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  public getFirstName(): string | null {
    return localStorage.getItem('firstName');
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }
}
