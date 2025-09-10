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
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MembersService } from '../services/members.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ActionInfo, Column } from '@app/shared/ui/table/table.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '@app/shared/ui/table/table.component';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import { LoaderComponent } from '@app/shared/ui/loader/loader.component';
import { AddMemberComponent } from '../components/add-member/add-member.component';
import { CoachesService } from '@app/features/coaches/services/coaches.service';
import { PlansService } from '@app/features/plans/services/plans.service';
import { IOption } from '@app/core/models/option.interface';
import { DeleteMemberComponent } from '../components/delete-member/delete-member.component';
import { UpdateMemberComponent } from '../components/update-member/update-member.component';

@Component({
  imports: [
    LucideAngularModule,
    ButtonModule,
    Select,
    FormsModule,
    InputGroupAddonModule,
    InputIconModule,
    IconFieldModule,
    TableComponent,
    PaginationComponent,
    LoaderComponent,
    AddMemberComponent,
    DeleteMemberComponent,
    UpdateMemberComponent,
  ],
  selector: 'app-members',
  templateUrl: './members.component.html',
  standalone: true,
})
export class MembersComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private coachsService = inject(CoachesService);
  private plansService = inject(PlansService);
  membersService = inject(MembersService);

  // Search handling with Subject for better debouncing
  private searchSubject = new Subject<string>();
  search = signal('');
  page = signal(1);
  perPage = signal(5);
  coaches = signal<IOption[]>([{ name: 'All', code: '' }]);
  plans = signal<IOption[]>([{ name: 'All', code: '' }]);

  // Status filter
  status = signal('');
  coach = signal('');
  plan = signal('');
  statusOptions = [
    { name: 'All', code: '' },
    { name: 'Paid', code: 'PAID' },
    { name: 'Unpaid', code: 'UNPAID' },
  ];

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
    { id: 1, field: 'fullName', header: 'Full name' },
    { id: 2, field: 'phoneNumber', header: 'Phone number' },
    { id: 3, field: 'startDate', header: 'Start date' },
    { id: 4, field: 'status', header: 'Status' },
    { id: 5, field: 'coach', header: 'Coach' },
    { id: 6, field: 'plan', header: 'Plan' },
  ];

  constructor() {
    // Handle page, perPage, and status changes (immediate fetch)
    effect(() => {
      const page = this.page();
      const perPage = this.perPage();
      const searchTerm = this.search();
      const statusFilter = this.status();
      const coachFilter = this.coach();
      const planFilter = this.plan();

      // Only fetch if this is a pagination/filter change (not search)
      if (this.membersService.initialized() && !this.isSearching) {
        this.fetchMembers(
          page,
          perPage,
          searchTerm,
          false,
          statusFilter,
          coachFilter,
          planFilter
        );
      }
    });

    // Setup search debouncing
    this.setupSearchDebouncing();
  }

  private isSearching = false;

  ngOnInit() {
    // Initial load - pass status parameter
    this.fetchMembers(
      this.page(),
      this.perPage(),
      '',
      false,
      this.status(),
      this.coach(),
      this.plan()
    );

    this.coachsService.fetchCoaches(1, 100).subscribe((data) => {
      const options = data.data.map((item) => ({
        name: item.fullName,
        code: item.id,
      }));
      this.coaches.update((prev) => [...prev, ...options]);
    });
    this.plansService.fetchPlans(1, 100).subscribe((data) => {
      const options = data.data.map((item) => ({
        name: item.name,
        code: item.id,
      }));
      this.plans.update((prev) => [...prev, ...options]);
    });
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

        // Pass current status when searching
        this.fetchMembers(
          1,
          this.perPage(),
          searchTerm,
          true,
          this.status(),
          this.coach(),
          this.plan()
        );

        // Reset searching flag after a short delay
        setTimeout(() => {
          this.isSearching = false;
        }, 100);
      });
  }

  private fetchMembers(
    page: number,
    perPage: number,
    searchTerm: string,
    isSearch: boolean,
    status?: string,
    coach?: string,
    plan?: string
  ) {
    this.membersService
      .fetchMembers(page, perPage, searchTerm, isSearch, status, coach, plan)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (error) => {
          console.error('Error fetching members:', error);
        },
      });
  }

  // Computed properties for better template logic
  get isInitialLoading(): boolean {
    return this.membersService.loading() && !this.membersService.initialized();
  }

  get isSearchLoading(): boolean {
    return this.membersService.searchLoading();
  }

  get hasMembers(): boolean {
    return this.membersService.members().data.length > 0;
  }

  get showNoDataMessage(): boolean {
    return (
      this.membersService.initialized() &&
      !this.isInitialLoading &&
      !this.isSearchLoading &&
      !this.hasMembers
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

  onStatusChange(): void {
    this.page.set(1);
    // Pass current status value
    this.fetchMembers(1, this.perPage(), this.search(), false, this.status());
  }
}
