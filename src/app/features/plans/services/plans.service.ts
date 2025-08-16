import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { finalize, catchError, throwError, tap, Observable } from 'rxjs';
import { PlanModel } from '../model/plan.model';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  private http$ = inject(HttpClient);
  private api$ = `${environment.apiUrl}/plans`;

  private _plans = signal<PlanModel[]>([]);
  plans = computed(() => this._plans());

  private _loading = signal(false);
  loading = computed(() => this._loading());

  private _error = signal<string | null>(null);
  error = computed(() => this._error());

  constructor() {
    this.fetchPlans();
  }

  fetchPlans(searchTerm?: string, isSearch = false) {
    if (!isSearch) {
      this._loading.set(true);
    }

    this._error.set(null);

    let params = new HttpParams();
    if (searchTerm) params = params.set('q', searchTerm);

    this.http$
      .get<PlanModel[]>(this.api$, { params })
      .pipe(
        finalize(() => {
          if (!isSearch) {
            this._loading.set(false);
          }
        }),
        catchError((err) => {
          this._error.set(err.error?.message || 'Failed to load plans');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data) => this._plans.set(data),
      });
  }

  getPlanById(id: string): Observable<PlanModel> {
    this._error.set(null);
    return this.http$.get<PlanModel>(`${this.api$}/${id}`).pipe(
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to add plan');
        return throwError(() => err);
      })
    );
  }

  addPlan(plan: PlanModel) {
    this._error.set(null);

    return this.http$.post<PlanModel>(`${this.api$}`, plan).pipe(
      tap((newPlan) => {
        this._plans.update((curr) => [...curr, newPlan]);
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to add plan');
        return throwError(() => err);
      })
    );
  }

  updatePlan(id: string, plan: PlanModel) {
    this._error.set(null);

    return this.http$.patch<PlanModel>(`${this.api$}/${id}`, plan).pipe(
      tap((updatedPlan) => {
        this._plans.update((curr) =>
          curr.map((p) => (p.id === id ? updatedPlan : p))
        );
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to update plan');
        return throwError(() => err);
      })
    );
  }

  deletePlan(id: string) {
    this._error.set(null);

    return this.http$.delete<void>(`${this.api$}/${id}`).pipe(
      tap(() => {
        this._plans.update((curr) => curr.filter((p) => p.id !== id));
      }),
      catchError((err) => {
        this._error.set(err.error?.message || 'Failed to delete plan');
        return throwError(() => err);
      })
    );
  }
}
