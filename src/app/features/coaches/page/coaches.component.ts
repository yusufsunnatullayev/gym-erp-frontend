import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { CoachesService } from '../services/coaches.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ActionInfo, Column } from '@app/shared/ui/table/table.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '@app/shared/ui/table/table.component';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import { LoaderComponent } from '@app/shared/ui/loader/loader.component';
import { IconField } from 'primeng/iconfield';
import { AddCoachComponent } from '../components/add-coach/add-coach.component';
import { Router } from '@angular/router';

@Component({
  imports: [
    LucideAngularModule,
    ButtonModule,
    TableComponent,
    PaginationComponent,
    LoaderComponent,
    IconField,
    AddCoachComponent,
  ],
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  standalone: true,
})
export class CoachesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  coachService = inject(CoachesService);

  // Search handling with Subject for better debouncing
  private searchSubject = new Subject<string>();
  search = signal('');
  page = signal(1);
  perPage = signal(5);

  // Icons
  SearchIcon = Search;
  PlusIcon = Plus;

  // Dialog states
  addDialogVisible = signal(false);

  // Table configuration
  columns: Column[] = [
    { id: 1, field: 'fullName', header: 'Full Name' },
    { id: 2, field: 'phoneNumber', header: 'Phone Number' },
    { id: 3, field: 'salary', header: 'Salary/month' },
    { id: 4, field: 'students', header: 'Students' },
  ];

  constructor() {
    // Handle page and perPage changes (immediate fetch)
    effect(() => {
      const page = this.page();
      const perPage = this.perPage();
      const searchTerm = this.search();

      // Only fetch if this is a pagination change (not search)
      if (this.coachService.initialized() && !this.isSearching) {
        this.fetchPlans(page, perPage, searchTerm, false);
      }
    });

    // Setup search debouncing
    this.setupSearchDebouncing();
  }

  private isSearching = false;

  ngOnInit() {
    // Initial load
    this.fetchPlans(this.page(), this.perPage(), '', false);
  }

  private setupSearchDebouncing() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm) => {
        this.isSearching = true;
        this.search.set(searchTerm);
        this.page.set(1); // Reset to first page on search

        this.fetchPlans(1, this.perPage(), searchTerm, true);

        // Reset searching flag after a short delay
        setTimeout(() => {
          this.isSearching = false;
        }, 100);
      });
  }

  private fetchPlans(
    page: number,
    perPage: number,
    searchTerm: string,
    isSearch: boolean
  ) {
    this.coachService
      .fetchCoaches(page, perPage, searchTerm, isSearch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => {
          console.error('Error fetching plans:', error);
        },
      });
  }

  // Computed properties for better template logic
  get isInitialLoading(): boolean {
    return this.coachService.loading() && !this.coachService.initialized();
  }

  get isSearchLoading(): boolean {
    return this.coachService.searchLoading();
  }

  get hasPlans(): boolean {
    return this.coachService.coaches().data.length > 0;
  }

  get showNoDataMessage(): boolean {
    return (
      this.coachService.initialized() &&
      !this.isInitialLoading &&
      !this.isSearchLoading &&
      !this.hasPlans
    );
  }

  handleRowClick(actionInfo: ActionInfo): void {
    console.log('Clicked row action info:', actionInfo);
    this.router.navigate([`/dashboard/coaches/${actionInfo.id}`]);
  }

  showAddDialog(): void {
    this.addDialogVisible.set(true);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.search.set('');
    this.searchSubject.next('');
  }
}
