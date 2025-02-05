import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environgment'
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
          this.storeUserData(response.token, response.userId, response.userRole);
        }
      })
    );
  }
  
  register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    dateOfBirth: string, 
    phoneNumber: string
  ): Observable<any> {
    const registerData = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
    };

    return this.http.post<any>(this.apiUrl + '/auth/register', registerData).pipe(
      tap(response => {
        if (response.token) {
          this.storeUserData(response.token, response.userId, response.userRole);
        }
      })
    );
  }

  private storeUserData(token: string, userId: number, userRole: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('userRole', userRole);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }
}

