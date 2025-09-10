import {
  Component,
  inject,
  input,
  model,
  OnInit,
  signal,
  effect,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '@app/shared/ui/modal/modal.component';
import { ToastService } from '@app/core/services/toast.service';
import { MembersService } from '../../services/members.service';
import { CoachesService } from '@app/features/coaches/services/coaches.service';
import { PlansService } from '@app/features/plans/services/plans.service';
import { IOption } from '@app/core/models/option.interface';
import { Select } from 'primeng/select';
import { MemberModel } from '../../model/member.model'; // Assuming you have a member model

@Component({
  imports: [
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    DatePickerModule,
    ReactiveFormsModule,
    ModalComponent,
    Select,
  ],
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  standalone: true,
})
export class UpdateMemberComponent implements OnInit {
  visible = model<boolean>(false);
  id = input<string>('');

  memberService = inject(MembersService);
  coachsService = inject(CoachesService);
  plansService = inject(PlansService);
  toastService = inject(ToastService);
  memberDetail = signal<MemberModel | null>(null);

  private loadMember(id: string) {
    this.memberService.getMemberById(id).subscribe((member) => {
      this.memberDetail.set(member);
      // Transform the data to match form structure if needed
      const formData = {
        ...member,
        // Handle phone number formatting if it comes with +998 prefix
        phoneNumber: member.phoneNumber?.startsWith('+998')
          ? member.phoneNumber.substring(4)
          : member.phoneNumber,
        // Ensure date is properly formatted for the date picker
        startDate: member.startDate ? new Date(member.startDate) : null,
      };
      this.form.patchValue(formData);
    });
  }

  form!: FormGroup;
  loading = signal(false);
  coaches = signal<IOption[]>([]);
  plans = signal<IOption[]>([]);

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.id()) {
        this.loadMember(this.id());
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: [null, Validators.required],
      startDate: [null, [Validators.required]],
      coachId: ['', [Validators.required]],
      planId: ['', [Validators.required]],
    });

    this.coachsService.fetchCoaches(1, 100).subscribe((data) => {
      const options = data.data.map((item) => ({
        name: item.fullName,
        code: item.id,
      }));
      this.coaches.set(options);
    });

    this.plansService.fetchPlans(1, 100).subscribe((data) => {
      const options = data.data.map((item) => ({
        name: item.name,
        code: item.id,
      }));
      this.plans.set(options);
    });
  }

  get fullName() {
    return this.form.get('fullName');
  }
  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get startDate() {
    return this.form.get('startDate');
  }
  get coachId() {
    return this.form.get('coachId');
  }
  get planId() {
    return this.form.get('planId');
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading.set(true);

      const payload = { ...this.form.value };

      if (payload.phoneNumber) {
        const cleaned = payload.phoneNumber.replace(/\D/g, '');

        if (cleaned.length === 9) {
          payload.phoneNumber = '+998' + cleaned;
        } else {
          this.loading.set(false);
          this.toastService.error('Error', "Telefon raqam noto'g'ri formatda!");
          return;
        }
      }

      this.memberService.updateMember(this.id(), payload).subscribe({
        next: () => {
          this.visible.set(false);
          this.form.reset();
          this.loading.set(false);
          this.toastService.success('Success', 'Member updated!');
        },
        error: (err) => {
          console.error('Error updating member:', err);
          this.loading.set(false);
          this.toastService.error('Error', 'Failed to update member!');
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
