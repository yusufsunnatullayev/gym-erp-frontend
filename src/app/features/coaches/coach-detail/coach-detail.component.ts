import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Image, Upload } from 'lucide-angular';
import { CoachesService } from '../services/coaches.service';
import { CoachModel } from '../model/coach.model';
import { DatePipe, CommonModule } from '@angular/common';
import { LoaderComponent } from '@app/shared/ui/loader/loader.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastService } from '@app/core/services/toast.service';
import { Column } from '@app/shared/ui/table/table.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-coach-detail',
  standalone: true,
  templateUrl: './coach-detail.component.html',
  imports: [
    LucideAngularModule,
    DatePipe,
    LoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    InputMaskModule,
    TableModule,
  ],
})
export class CoachDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private coachService = inject(CoachesService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  coachId = signal<string | null>(null);
  coachData = signal<CoachModel | null>(null);
  loading = signal(false);
  updating = signal(false);
  deleting = signal(false);
  selectedImagePreview = signal<string | null>(null);

  form!: FormGroup;

  LeftIcon = ArrowLeft;
  ImageIcon = Image;
  UploadIcon = Upload;

  ngOnInit(): void {
    this.initForm();
    this.loadCoachData();
  }

  // Table configuration
  columns: Column[] = [
    { id: 1, field: 'fullName', header: 'Full Name' },
    { id: 2, field: 'phoneNumber', header: 'Phone Number' },
    { id: 3, field: 'startDate', header: 'Start Date' },
  ];

  private loadCoachData(): void {
    this.loading.set(true);

    const id = this.route.snapshot.paramMap.get('id');
    this.coachId.set(id);

    if (id) {
      this.coachService.getCoachById(id).subscribe({
        next: (data) => {
          this.coachData.set(data);
          this.form.patchValue({
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            salary: data.salary,
          });
          this.form.get('picture')?.clearValidators();
          this.form.get('picture')?.updateValueAndValidity();
          this.loading.set(false);
          console.log(this.coachData());
        },
        error: (err) => {
          console.error('Failed to load coach details', err);
          this.loading.set(false);
        },
      });
    } else {
      console.warn('No coach ID found in route');
      this.loading.set(false);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(0)]],
      picture: [null],
    });
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard/coaches']);
  }

  onSubmit(): void {
    if (this.form.valid && this.coachId()) {
      this.updating.set(true);

      const formValue = this.form.value;

      let phoneNumber: string = formValue.phoneNumber?.trim() || '';
      const cleaned = phoneNumber.replace(/\D/g, '');

      if (cleaned.startsWith('998') && cleaned.length === 12) {
        phoneNumber = '+' + cleaned;
      } else if (cleaned.length === 9) {
        phoneNumber = '+998' + cleaned;
      } else {
        this.updating.set(false);
        this.toastService.error('Error', "Telefon raqam noto'g'ri formatda!");
        return;
      }

      let salary = formValue.salary;
      if (salary !== null && salary !== undefined) {
        salary = parseInt(String(salary).replace(/\D/g, ''), 10);
        if (isNaN(salary) || salary < 0) {
          this.updating.set(false);
          this.toastService.error(
            'Error',
            'Salary must be a valid positive number!'
          );
          return;
        }
      }

      const hasPicture = formValue.picture && formValue.picture instanceof File;

      if (hasPicture) {
        const formData = new FormData();
        formData.append('fullName', formValue.fullName);
        formData.append('phoneNumber', phoneNumber);
        formData.append('salary', salary.toString());
        formData.append('picture', formValue.picture);

        this.coachService.updateCoach(this.coachId()!, formData).subscribe({
          next: (response) => {
            this.updating.set(false);
            this.coachData.set(response);
            this.selectedImagePreview.set(null);
            this.toastService.success('Success', 'Coach data updated!');
          },
          error: (error) => {
            console.error('Failed to update coach:', error);
            this.updating.set(false);
            this.toastService.error('Error', 'Failed to update coach data');
          },
        });
      } else {
        const jsonPayload = {
          fullName: formValue.fullName,
          phoneNumber: phoneNumber,
          salary: salary,
        };

        this.coachService.updateCoach(this.coachId()!, jsonPayload).subscribe({
          next: (response) => {
            this.updating.set(false);
            this.coachData.set(response);
            this.selectedImagePreview.set(null);
            this.toastService.success('Success', 'Coach data updated!');
          },
          error: (error) => {
            console.error('Failed to update coach:', error);
            this.updating.set(false);
            this.toastService.error('Error', 'Failed to update coach data');
          },
        });
      }
    } else {
      this.form.markAllAsTouched();
      if (!this.coachId()) {
        console.error('No coach ID found');
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.form.patchValue({ picture: file });
      this.form.get('picture')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onDelete(): void {
    const coachId = this.coachId();
    if (!coachId) {
      this.toastService.error('Error', 'Coach ID not found!');
      return;
    }

    this.deleting.set(true);

    this.coachService.deleteCoach(coachId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.toastService.success('Success', 'Coach deleted!');
        this.router.navigate(['/dashboard/coaches']);
      },
      error: (error) => {
        console.error('❌ Delete failed:', error);
        this.deleting.set(false);
        this.toastService.error('Error', 'Failed to delete coach data!');
      },
    });
  }

  get isUpdating(): boolean {
    return this.updating();
  }

  getCurrentImageSrc(): string | null {
    return this.selectedImagePreview() || this.coachData()?.picture || null;
  }
}
