import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  effect,
  model,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlansService } from '../../services/plans.service';
import { PlanModel } from '../../model/plan.model';

interface Duration {
  name: string;
  code: string;
}

@Component({
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    DatePickerModule,
    Select,
    InputNumber,
    ReactiveFormsModule,
  ],
  selector: 'app-update-plan',
  templateUrl: './update-plan.component.html',
  standalone: true,
})
export class UpdateComponent implements OnInit {
  visible = model<boolean>(false);
  id = input<string>('');

  plansService = inject(PlansService);
  planDetail = signal<PlanModel | null>(null);

  private loadPlan(id: string) {
    this.plansService.getPlanById(id).subscribe((plan) => {
      this.planDetail.set(plan);
      this.form.patchValue(plan);
    });
  }

  form!: FormGroup;
  durations = signal<Duration[]>([
    {
      name: 'Once',
      code: 'ONCE',
    },
    {
      name: 'Monthly',
      code: 'MONTHLY',
    },
    {
      name: 'Semi-annual',
      code: 'SEMIANNUAL',
    },
    {
      name: 'Annual',
      code: 'ANNUAL',
    },
  ]);
  loading = signal(false);
  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.id()) {
        this.loadPlan(this.id());
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      duration: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  get name() {
    return this.form.get('name');
  }
  get durationControl() {
    return this.form.get('duration');
  }
  get price() {
    return this.form.get('price');
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading.set(true);
      this.plansService.updatePlan(this.id(), this.form.value).subscribe({
        next: () => {
          this.visible.set(false);
          this.form.reset();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error adding plan:', err);
          this.loading.set(false);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
