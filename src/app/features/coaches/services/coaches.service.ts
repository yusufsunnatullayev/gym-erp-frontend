import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { CoachModel } from '../model/coach.model';
import { Data } from '@app/shared/ui/table/table.model';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoachesService {
  private http$ = inject(HttpClient);
  private api$ = `${environment.apiUrl}/coaches`;

  private _coaches = signal<Data<CoachModel[]>>({
    data: [],
    meta: {
      total: 0,
      total_pages: 0,
      page: 0,
      per_page: 0,
    },
  });
  coaches = computed(() => this._coaches());

  private _loading = signal(false);
  loading = computed(() => this._loading());

  private _searchLoading = signal(false);
  searchLoading = computed(() => this._searchLoading());

  private _error = signal<string | null>(null);
  error = computed(() => this._error());

  private _initialized = signal(false);
  initialized = computed(() => this._initialized());

  fetchCoaches(
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = '',
    isSearch: boolean = false
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

    return this.http$.get<Data<CoachModel[]>>(this.api$, { params }).pipe(
      finalize(() => {
        if (isSearch) {
          this._searchLoading.set(false);
        } else {
          this._loading.set(false);
        }
        this._initialized.set(true);
      }),
      catchError((err) => {
        const errorMessage = err.error?.message || 'Failed to load coaches';
        this._error.set(errorMessage);
        return throwError(() => err);
      }),
      tap((data) => {
        this._coaches.set(data);
      })
    );
  }

  getCoachById(id: string): Observable<CoachModel> {
    this._error.set(null);
    return this.http$.get<CoachModel>(`${this.api$}/${id}`).pipe(
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to get coach');
        return throwError(() => err);
      })
    );
  }

  addCoach(coach: Omit<CoachModel, 'id'>) {
    this._error.set(null);

    return this.http$.post<CoachModel>(`${this.api$}`, coach).pipe(
      tap((newCoach) => {
        this._coaches.update((curr) => ({
          ...curr,
          data: [newCoach, ...curr.data],
          meta: {
            ...curr.meta,
            total: curr.meta.total + 1,
          },
        }));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to add coach');
        return throwError(() => err);
      })
    );
  }

  updateCoach(id: string, coach: Partial<CoachModel> | FormData) {
    this._error.set(null);

    return this.http$.patch<CoachModel>(`${this.api$}/${id}`, coach).pipe(
      tap((updatedCoach) => {
        this._coaches.update((curr) => ({
          ...curr,
          data: curr.data.map((p) => (p.id === id ? updatedCoach : p)),
        }));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to update coach');
        return throwError(() => err);
      })
    );
  }

  deleteCoach(id: string) {
    this._error.set(null);

    return this.http$.delete<void>(`${this.api$}/${id}`).pipe(
      tap(() => {
        this._coaches.update((curr) => ({
          ...curr,
          data: curr.data.filter((p) => p.id !== id),
          meta: {
            ...curr.meta,
            total: Math.max(0, curr.meta.total - 1),
          },
        }));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to delete coach');
        return throwError(() => err);
      })
    );
  }

  // Utility method to reset state
  reset() {
    this._coaches.set({
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
