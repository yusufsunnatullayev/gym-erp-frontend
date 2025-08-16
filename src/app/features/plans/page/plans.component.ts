import { Component, effect, inject, signal } from '@angular/core';
import { LucideAngularModule, Search, Plus } from 'lucide-angular';
import { LoaderComponent } from '@app/shared/ui/loader/loader.component';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { PlansService } from '../services/plans.service';
import { ActionInfo, Column } from '@app/shared/ui/table/table.model';
import { TableComponent } from '@app/shared/ui/table/table.component';
import { AddPlanComponent } from '../components/add-plan/add-plan.component';
import { NameComponent } from '../components/delete-plan/delete-plan.component';
import { UpdateComponent } from '../components/update-plan/update-plan.component';

@Component({
  imports: [
    LucideAngularModule,
    LoaderComponent,
    IconFieldModule,
    ButtonModule,
    TableComponent,
    AddPlanComponent,
    NameComponent,
    UpdateComponent,
  ],
  selector: 'app-plan',
  templateUrl: './plans.component.html',
  standalone: true,
})
export class PlansComponent {
  plansService = inject(PlansService);
  search = signal('');

  constructor() {
    effect(() => {
      const term = this.search();
      setTimeout(() => this.plansService.fetchPlans(term, true), 300);
    });
  }

  SearchIcon = Search;
  PlusIcon = Plus;

  selectedId = signal('');
  addDialogVisible = signal(false);
  deleteDialogVisible = signal(false);
  updateDialogVisible = signal(false);

  columns: Column[] = [
    { id: 1, field: 'name', header: 'Name' },
    { id: 2, field: 'duration', header: 'Duration' },
    { id: 3, field: 'price', header: 'Price' },
    { id: 4, field: 'members', header: 'Members' },
  ];

  handleRowClick(actionInfo: ActionInfo) {
    console.log('Clicked row action info:', actionInfo);
    if (actionInfo.action_type === 'delete') {
      this.deleteDialogVisible.set(true);
      this.selectedId.set(actionInfo.id);
    } else if (actionInfo.action_type === 'edit') {
      this.updateDialogVisible.set(true);
      this.selectedId.set(actionInfo.id);
    }
  }

  showAddDialog() {
    this.addDialogVisible.set(true);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }
}
