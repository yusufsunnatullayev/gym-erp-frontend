import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Data } from '@app/shared/ui/table/table.model';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { MemberModel } from '../model/member.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private http$ = inject(HttpClient);
  private api$ = `${environment.apiUrl}/members`;

  private _members = signal<Data<MemberModel[]>>({
    data: [],
    meta: {
      total: 0,
      total_pages: 0,
      page: 0,
      per_page: 0,
    },
  });
  members = computed(() => this._members());

  private _loading = signal(false);
  loading = computed(() => this._loading());

  private _searchLoading = signal(false);
  searchLoading = computed(() => this._searchLoading());

  private _error = signal<string | null>(null);
  error = computed(() => this._error());

  private _initialized = signal(false);
  initialized = computed(() => this._initialized());

  fetchMembers(
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = '',
    isSearch: boolean = false,
    status?: string,
    coach?: string,
    plan?: string
  ) {
    if (isSearch) {
      this._searchLoading.set(true);
    } else {
      this._loading.set(true);
    }

    this._error.set(null);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (searchTerm.trim()) {
      params = params.set('q', searchTerm.trim());
    }

    if (status?.trim()) {
      params = params.set('status', status);
    }

    if (coach?.trim()) {
      params = params.set('coach', coach);
    }

    if (plan?.trim()) {
      params = params.set('plan', plan);
    }

    return this.http$.get<Data<MemberModel[]>>(this.api$, { params }).pipe(
      finalize(() => {
        if (isSearch) {
          this._searchLoading.set(false);
        } else {
          this._loading.set(false);
        }
        this._initialized.set(true);
      }),
      catchError((err) => {
        const errorMessage = err.error?.message || 'Failed to load members';
        this._error.set(errorMessage);
        return throwError(() => err);
      }),
      tap((data) => {
        this._members.set(data);
      })
    );
  }

  getMemberById(id: string): Observable<MemberModel> {
    this._error.set(null);
    return this.http$.get<MemberModel>(`${this.api$}/${id}`).pipe(
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to get member');
        return throwError(() => err);
      })
    );
  }

  addMember(member: Omit<MemberModel, 'id'>) {
    this._error.set(null);

    return this.http$.post<MemberModel>(`${this.api$}`, member).pipe(
      tap((newMember) => {
        this._members.update((curr) => ({
          ...curr,
          data: [newMember, ...curr.data],
          meta: {
            ...curr.meta,
            total: curr.meta.total + 1,
          },
        }));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to add member');
        return throwError(() => err);
      })
    );
  }

  updateMember(id: string, member: Partial<MemberModel>) {
    this._error.set(null);

    return this.http$.patch<MemberModel>(`${this.api$}/${id}`, member).pipe(
      tap((updatedMember) => {
        this._members.update((curr) => ({
          ...curr,
          data: curr.data.map((p) => (p.id === id ? updatedMember : p)),
        }));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to update member');
        return throwError(() => err);
      })
    );
  }

  delete(id: string) {
    this._error.set(null);

    return this.http$.delete<void>(`${this.api$}/${id}`).pipe(
      tap(() => {
        this._members.update((curr) => ({
          ...curr,
          data: curr.data.filter((p) => p.id !== id),
          meta: {
            ...curr.meta,
            total: Math.max(0, curr.meta.total - 1),
          },
        }));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to delete member');
        return throwError(() => err);
      })
    );
  }

  // Utility method to reset state
  reset() {
    this._members.set({
      data: [],
      meta: {
        total: 0,
        total_pages: 0,
        page: 0,
        per_page: 0,
      },
    });
    this._loading.set(false);
    this._searchLoading.set(false);
    this._error.set(null);
    this._initialized.set(false);
  }
}
