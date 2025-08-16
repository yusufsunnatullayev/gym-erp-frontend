import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PlansService } from '../../services/plans.service';

@Component({
  imports: [Dialog, ButtonModule],
  selector: 'app-delete-plan',
  templateUrl: './delete-plan.component.html',
  standalone: true,
})
export class NameComponent implements OnInit {
  visible = model<boolean>(false);
  id = input<string>('');
  private plansService = inject(PlansService);
  loading = signal(false);

  ngOnInit(): void {}

  onDelete() {
    this.loading.set(true);
    this.plansService.deletePlan(this.id()).subscribe({
      next: () => {
        this.visible.set(false);
        this.loading.set(false);
      },
      error: () => {
        console.log('Error with deleting plan!');
        this.loading.set(false);
      },
    });
  }
}
