import { Component, inject, model, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '@app/shared/ui/modal/modal.component';
import { ToastService } from '@app/core/services/toast.service';
import { CoachesService } from '../../services/coaches.service';

@Component({
  imports: [
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    DatePickerModule,
    InputNumber,
    ReactiveFormsModule,
    ModalComponent,
  ],
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  standalone: true,
})
export class AddCoachComponent implements OnInit {
  visible = model<boolean>(false);
  coachService = inject(CoachesService);
  toastService = inject(ToastService);

  form!: FormGroup;
  loading = signal(false);
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: [null, Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]],
    });
  }

  get fullName() {
    return this.form.get('fullName');
  }
  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get salary() {
    return this.form.get('salary');
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading.set(true);
      this.coachService.addCoach(this.form.value).subscribe({
        next: () => {
          this.visible.set(false);
          this.form.reset();
          this.loading.set(false);
          this.toastService.success('Success', 'Coach added!');
        },
        error: (err) => {
          console.error('Error adding plan:', err);
          this.loading.set(false);
          this.toastService.error('Error', 'Failed to add new coach!');
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
