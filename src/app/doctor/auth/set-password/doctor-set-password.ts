import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TranslocoModule } from '@jsverse/transloco';
import { DoctorAuthService } from '../../../api/doctor/auth';

@Component({
  selector: 'app-doctor-set-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    TranslocoModule,
  ],
  templateUrl: './doctor-set-password.html',
  styleUrl: './doctor-set-password.scss',
})
export class DoctorSetPasswordComponent implements OnInit {
  form!: FormGroup;
  token = '';
  submitting = signal(false);
  success = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorAuthService: DoctorAuthService,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/[A-Z]/),
            Validators.pattern(/[a-z]/),
            Validators.pattern(/[0-9]/),
            Validators.pattern(/[^A-Za-z0-9]/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  get f() {
    return this.form.controls;
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.token) {
      this.errorMessage.set('Invalid set-password link. No token provided.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.doctorAuthService
      .setPassword({ token: this.token, password: this.f['password'].value })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set(true);
        },
        error: (err) => {
          this.submitting.set(false);
          const message =
            err?.error?.message ??
            'Something went wrong. The link may have expired.';
          this.errorMessage.set(message);
        },
      });
  }
}
