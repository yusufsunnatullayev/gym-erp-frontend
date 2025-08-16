import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Observable,
  switchMap,
  tap,
  finalize,
  catchError,
  throwError,
} from 'rxjs';
import { AuthModel } from '../models/auth.model';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http$ = inject(HttpClient);
  private api$ = environment.apiUrl;
  private router = inject(Router);

  private _profile = signal<AuthModel | null>(
    JSON.parse(localStorage.getItem('adminProfile') ?? 'null')
  );
  profile = computed(() => this._profile());

  private _loading = signal(false);
  loading = computed(() => this._loading());

  private _error = signal<string | null>(null);
  error = computed(() => this._error());

  getProfile(): Observable<AuthModel> {
    return this.http$.get<AuthModel>(`${this.api$}/admin/profile`).pipe(
      tap((profile) => {
        this._profile.set(profile);
        localStorage.setItem('adminProfile', JSON.stringify(profile));
      })
    );
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<AuthModel> {
    this._loading.set(true);
    this._error.set(null);

    return this.http$
      .post<{ access_token: string }>(`${this.api$}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          sessionStorage.setItem('access_token', response.access_token);
        }),
        switchMap(() => this.getProfile()),
        finalize(() => this._loading.set(false)),
        catchError((err) => {
          this._error.set(err.error?.message || 'Login failed');
          return throwError(() => err);
        })
      );
  }

  logout() {
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('adminProfile');
    this.router.navigateByUrl('/login');
    this._profile.set(null);
  }
}
