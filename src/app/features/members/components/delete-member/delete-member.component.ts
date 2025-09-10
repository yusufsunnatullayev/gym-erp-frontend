import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ModalComponent } from '@app/shared/ui/modal/modal.component';
import { ToastService } from '@app/core/services/toast.service';
import { MembersService } from '../../services/members.service';

@Component({
  imports: [ButtonModule, ModalComponent],
  selector: 'app-delete-member',
  templateUrl: './delete-member.component.html',
  standalone: true,
})
export class DeleteMemberComponent implements OnInit {
  visible = model<boolean>(false);
  id = input<string>('');

  private toastService = inject(ToastService);
  private membersService = inject(MembersService);
  loading = signal(false);

  ngOnInit(): void {}

  onDelete() {
    this.loading.set(true);
    this.membersService.delete(this.id()).subscribe({
      next: () => {
        this.visible.set(false);
        this.loading.set(false);
        this.toastService.success('Success', 'Member deleted!');
      },
      error: () => {
        console.log('Error with deleting member!');
        this.loading.set(false);
        this.toastService.error('Error', 'Failed to delete member!');
      },
    });
  }
}
