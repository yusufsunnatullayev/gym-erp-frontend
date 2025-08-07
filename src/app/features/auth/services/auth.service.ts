import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '@environments/environment.prod';
import { AuthModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private profileSubject = new BehaviorSubject<AuthModel | null>(
    JSON.parse(localStorage.getItem('adminProfile') || 'null')
  );
  profile$ = this.profileSubject.asObservable();

  getProfile(): Observable<AuthModel> {
    return this.http.get<AuthModel>(`${this.apiUrl}/admin/profile`).pipe(
      tap((profile) => {
        this.profileSubject.next(profile);
        localStorage.setItem('adminProfile', JSON.stringify(profile));
      })
    );
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<AuthModel> {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          sessionStorage.setItem('access_token', response.access_token);
        }),
        switchMap(() => this.getProfile())
      );
  }
}
