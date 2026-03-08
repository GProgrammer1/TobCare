import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthStateService } from '../../auth/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    TranslocoModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  form: FormGroup;
  submitting = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authState: AuthStateService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.authState
      .loginAndRedirect(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.submitting.set(false);
        },
        error: (err) => {
          this.submitting.set(false);
          const message =
            err?.error?.message ?? 'Invalid email or password. Please try again.';
          this.errorMessage.set(message);
        },
      });
  }
}
