import { Component, input, model } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  imports: [Dialog],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  visible = model<boolean>(false);

  header = input<string>('');
  width = input<string>('25rem');
  closable = input<boolean>(true);

  close() {
    this.visible.set(false);
  }
}
