import {
  Component,
  effect,
  inject,
  signal,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';
import { LoaderComponent } from '@app/shared/ui/loader/loader.component';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { PlansService } from '../services/plans.service';
import { ActionInfo, Column } from '@app/shared/ui/table/table.model';
import { TableComponent } from '@app/shared/ui/table/table.component';
import { AddPlanComponent } from '../components/add-plan/add-plan.component';
import { UpdateComponent } from '../components/update-plan/update-plan.component';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DeletePlanComponent } from '../components/delete-plan/delete-plan.component';

@Component({
  imports: [
    LucideAngularModule,
    LoaderComponent,
    IconFieldModule,
    ButtonModule,
    TableComponent,
    AddPlanComponent,
    UpdateComponent,
    PaginationComponent,
    DeletePlanComponent,
  ],
  selector: 'app-plan',
  templateUrl: './plans.component.html',
  standalone: true,
})
export class PlansComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  plansService = inject(PlansService);

  // Search handling with Subject for better debouncing
  private searchSubject = new Subject<string>();
  search = signal('');
  page = signal(1);
  perPage = signal(5);

  // Icons
  SearchIcon = Search;
  PlusIcon = Plus;

  // Dialog states
  selectedId = signal('');
  addDialogVisible = signal(false);
  deleteDialogVisible = signal(false);
  updateDialogVisible = signal(false);

  // Table configuration
  columns: Column[] = [
    { id: 1, field: 'name', header: 'Name' },
    { id: 2, field: 'duration', header: 'Duration' },
    { id: 3, field: 'price', header: 'Price' },
    { id: 4, field: 'members', header: 'Members' },
  ];

  constructor() {
    // Handle page and perPage changes (immediate fetch)
    effect(() => {
      const page = this.page();
      const perPage = this.perPage();
      const searchTerm = this.search();

      // Only fetch if this is a pagination change (not search)
      if (this.plansService.initialized() && !this.isSearching) {
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
    this.plansService
      .fetchPlans(page, perPage, searchTerm, isSearch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => {
          console.error('Error fetching plans:', error);
        },
      });
  }

  // Computed properties for better template logic
  get isInitialLoading(): boolean {
    return this.plansService.loading() && !this.plansService.initialized();
  }

  get isSearchLoading(): boolean {
    return this.plansService.searchLoading();
  }

  get hasPlans(): boolean {
    return this.plansService.plans().data.length > 0;
  }

  get showNoDataMessage(): boolean {
    return (
      this.plansService.initialized() &&
      !this.isInitialLoading &&
      !this.isSearchLoading &&
      !this.hasPlans
    );
  }

  handleRowClick(actionInfo: ActionInfo): void {
    console.log('Clicked row action info:', actionInfo);

    this.selectedId.set(actionInfo.id);

    switch (actionInfo.action_type) {
      case 'delete':
        this.deleteDialogVisible.set(true);
        break;
      case 'edit':
        this.updateDialogVisible.set(true);
        break;
      default:
        console.warn('Unknown action type:', actionInfo.action_type);
    }
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
