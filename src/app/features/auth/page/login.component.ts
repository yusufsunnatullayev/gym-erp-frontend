import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  imports: [CommonModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  authForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get username() {
    return this.authForm.get('username');
  }

  get password() {
    return this.authForm.get('password');
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const credentials = {
      username: this.username?.value ?? '',
      password: this.password?.value ?? '',
    };
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.toastService.success('Success', 'You have logged in!');
      },
      error: (err) => {
        console.log(err);
        this.toastService.error(
          'Error',
          err.error.message || 'Failed to log in!'
        );
      },
    });
  }
}
