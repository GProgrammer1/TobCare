import { Component, signal, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslocoModule } from '@jsverse/transloco';
import { PatientAuthService } from '../../../api/patient/auth';
import { AuthService } from '../../../api/common/auth';

/* ── Enum options (matching backend Prisma schema) ── */
export const GENDER_OPTIONS = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
];

export const BLOOD_TYPE_OPTIONS = [
    { label: 'A+', value: 'A_POS' },
    { label: 'A−', value: 'A_NEG' },
    { label: 'B+', value: 'B_POS' },
    { label: 'B−', value: 'B_NEG' },
    { label: 'AB+', value: 'AB_POS' },
    { label: 'AB−', value: 'AB_NEG' },
    { label: 'O+', value: 'O_POS' },
    { label: 'O−', value: 'O_NEG' },
];

export const DRINKING_STATUS_OPTIONS = [
    { label: 'Never', value: 'NEVER' },
    { label: 'Occasional', value: 'OCCASIONAL' },
    { label: 'Regular', value: 'REGULAR' },
];

export const SMOKING_STATUS_OPTIONS = [
    { label: 'Never', value: 'NEVER' },
    { label: 'Former', value: 'FORMER' },
    { label: 'Current', value: 'CURRENT' },
];

export const SEVERITY_OPTIONS = [
    { label: 'Mild', value: 'MILD' },
    { label: 'Moderate', value: 'MODERATE' },
    { label: 'Severe', value: 'SEVERE' },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2000, i).toLocaleString('en', { month: 'long' }),
    value: i + 1,
}));

const PASSWORD_VALIDATORS = [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/[A-Z]/),
    Validators.pattern(/[a-z]/),
    Validators.pattern(/[0-9]/),
    Validators.pattern(/[^A-Za-z0-9]/),
];

@Component({
    selector: 'app-patient-signup',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        InputTextModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        InputNumberModule,
        TranslocoModule,
    ],
    templateUrl: './patient-signup.html',
    styleUrl: './patient-signup.scss',
})
export class PatientSignupComponent {
    @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

    currentStep = signal(1);
    totalSteps = 5;

    /* ── Date bounds ── */
    today = new Date();

    /* ── Enum option references for templates ── */
    genderOptions = GENDER_OPTIONS;
    bloodTypeOptions = BLOOD_TYPE_OPTIONS;
    drinkingOptions = DRINKING_STATUS_OPTIONS;
    smokingOptions = SMOKING_STATUS_OPTIONS;
    severityOptions = SEVERITY_OPTIONS;
    monthOptions = MONTH_OPTIONS;
    medicationConditionOptions = [
        { label: 'Disease', value: 'disease' },
        { label: 'Allergy', value: 'allergy' },
    ];

    /* ── OTP State ── */
    showOtp = signal(false);
    otpSent = signal(false);
    otpSending = signal(false);
    otpVerifying = signal(false);
    otpError = signal('');
    otpDigits = signal<string[]>(['', '', '', '', '', '']);
    private signupPayload: Record<string, unknown> | null = null;

    signupForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private patientAuthService: PatientAuthService,
        private authService: AuthService,
        private router: Router,
    ) {
        this.signupForm = this.fb.group({
            /* — Step 1: Account — */
            firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
            lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
            password: ['', PASSWORD_VALIDATORS],
            confirmPassword: ['', [Validators.required]],

            /* — Step 2: Personal Info — */
            dateOfBirth: [null, [Validators.required]],
            gender: [null, [Validators.required]],
            bloodType: [null, [Validators.required]],
            heightCm: [null, [Validators.required, Validators.min(1), Validators.max(300)]],
            weightKg: [null, [Validators.required, Validators.min(1), Validators.max(200)]],

            /* — Step 3: Lifestyle — */
            drinkingStatus: [null],
            smokingStatus: [null],

            /* — Step 4: Emergency Contacts — */
            emergencyContacts: this.fb.array([]),

            /* — Step 5: Medications — */
            medications: this.fb.array([]),
        });

        this.signupForm.get('confirmPassword')?.addValidators(this.createMatchValidator());
        this.signupForm.get('password')?.valueChanges.subscribe(() => {
            this.signupForm.get('confirmPassword')?.updateValueAndValidity();
        });
    }

    onDateSelect(_selected: Date): void {
        // no-op: handled by reactive forms
    }

    /* ── Validators ── */
    private createMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = this.signupForm?.get('password')?.value;
            return control.value === password ? null : { mismatch: true };
        };
    }

    /* ── Helpers ── */
    get f() {
        return this.signupForm.controls;
    }

    currentYear(): number {
        return new Date().getFullYear();
    }

    /* ── FormArray Getters ── */
    get emergencyContacts(): FormArray {
        return this.signupForm.get('emergencyContacts') as FormArray;
    }

    get medications(): FormArray {
        return this.signupForm.get('medications') as FormArray;
    }

    /* ── Add / Remove for FormArrays ── */
    addEmergencyContact(): void {
        this.emergencyContacts.push(
            this.fb.group({
                name: ['', [Validators.required, Validators.minLength(1)]],
                phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
            }),
        );
    }

    removeEmergencyContact(i: number): void {
        this.emergencyContacts.removeAt(i);
    }

    addMedication(): void {
        const med = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(1)]],
            dose: ['', [Validators.required, Validators.minLength(1)]],
            frequency: ['', [Validators.required, Validators.minLength(1)]],
            prescribedYear: [null, [Validators.required, Validators.min(1900), Validators.max(this.currentYear())]],
            prescribedMonth: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
            conditionType: [null as 'disease' | 'allergy' | null, [Validators.required]],
            disease: this.fb.group({
                name: [''],
                diagnosedYear: [null],
                diagnosedMonth: [null],
            }),
            allergy: this.fb.group({
                name: [''],
                diagnosedYear: [null],
                diagnosedMonth: [null],
                severity: [null],
            }),
        });
        med.get('conditionType')?.valueChanges.subscribe((v) => {
            this.updateMedicationConditionValidators(med, v);
        });
        this.medications.push(med);
    }

    private updateMedicationConditionValidators(
        med: FormGroup,
        conditionType: 'disease' | 'allergy' | null,
    ): void {
        const disease = med.get('disease');
        const allergy = med.get('allergy');
        const year = this.currentYear();
        const diseaseValidators = [
            Validators.required,
            Validators.minLength(1),
        ];
        const yearValidators = [
            Validators.required,
            Validators.min(1900),
            Validators.max(year),
        ];
        const monthValidators = [
            Validators.required,
            Validators.min(1),
            Validators.max(12),
        ];
        if (conditionType === 'disease') {
            disease?.get('name')?.setValidators(diseaseValidators);
            disease?.get('diagnosedYear')?.setValidators(yearValidators);
            disease?.get('diagnosedMonth')?.setValidators(monthValidators);
            allergy?.get('name')?.clearValidators();
            allergy?.get('diagnosedYear')?.clearValidators();
            allergy?.get('diagnosedMonth')?.clearValidators();
            allergy?.get('severity')?.clearValidators();
            allergy?.patchValue({ name: '', diagnosedYear: null, diagnosedMonth: null, severity: null });
        } else if (conditionType === 'allergy') {
            allergy?.get('name')?.setValidators(diseaseValidators);
            allergy?.get('diagnosedYear')?.setValidators(yearValidators);
            allergy?.get('diagnosedMonth')?.setValidators(monthValidators);
            allergy?.get('severity')?.setValidators([Validators.required]);
            disease?.get('name')?.clearValidators();
            disease?.get('diagnosedYear')?.clearValidators();
            disease?.get('diagnosedMonth')?.clearValidators();
            disease?.patchValue({ name: '', diagnosedYear: null, diagnosedMonth: null });
        } else {
            disease?.get('name')?.clearValidators();
            disease?.get('diagnosedYear')?.clearValidators();
            disease?.get('diagnosedMonth')?.clearValidators();
            allergy?.get('name')?.clearValidators();
            allergy?.get('diagnosedYear')?.clearValidators();
            allergy?.get('diagnosedMonth')?.clearValidators();
            allergy?.get('severity')?.clearValidators();
        }
        disease?.updateValueAndValidity({ emitEvent: false });
        allergy?.updateValueAndValidity({ emitEvent: false });
    }

    removeMedication(i: number): void {
        this.medications.removeAt(i);
    }

    /* ── Step‑field mapping for per‑step validation ── */
    private stepFields: Record<number, string[]> = {
        1: ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'],
        2: ['dateOfBirth', 'gender', 'bloodType', 'heightCm', 'weightKg'],
        3: ['drinkingStatus', 'smokingStatus'],
        4: ['emergencyContacts'],
        5: ['medications'],
    };

    private isStepValid(step: number): boolean {
        const fields = this.stepFields[step] || [];
        return fields.every((name) => {
            const ctrl = this.signupForm.get(name);
            return ctrl ? ctrl.valid : true;
        });
    }

    private markStepTouched(step: number): void {
        const fields = this.stepFields[step] || [];
        fields.forEach((name) => {
            const ctrl = this.signupForm.get(name);
            if (ctrl instanceof FormArray) {
                ctrl.controls.forEach((group) => {
                    if (group instanceof FormGroup) {
                        Object.values(group.controls).forEach((c) => c.markAsTouched());
                    }
                });
            } else {
                ctrl?.markAsTouched();
            }
        });
    }

    /* ── Navigation ── */
    onContinue(): void {
        const step = this.currentStep();
        if (this.isStepValid(step)) {
            if (step < this.totalSteps) {
                this.currentStep.set(step + 1);
            } else {
                this.prepareOtp();
            }
        } else {
            this.markStepTouched(step);
        }
    }

    onBack(): void {
        const step = this.currentStep();
        if (step > 1) {
            this.currentStep.set(step - 1);
        }
    }

    /* ── OTP Flow ── */
    private prepareOtp(): void {
        if (!this.signupForm.valid) {
            this.signupForm.markAllAsTouched();
            return;
        }
        const raw = this.signupForm.value;
        const medications = (raw.medications ?? []).map((m: {
            conditionType: 'disease' | 'allergy';
            disease: { name: string; diagnosedYear: number; diagnosedMonth: number };
            allergy: { name: string; diagnosedYear: number; diagnosedMonth: number; severity: string };
        } & Record<string, unknown>) => {
            const { conditionType, disease, allergy, ...rest } = m;
            if (conditionType === 'disease' && disease?.name) {
                return { ...rest, disease };
            }
            if (conditionType === 'allergy' && allergy?.name) {
                return { ...rest, allergy };
            }
            return { ...rest };
        });
        const payload: Record<string, unknown> = {
            ...raw,
            medications,
            role: 'PATIENT' as const,
            dateOfBirth:
                raw.dateOfBirth instanceof Date
                    ? raw.dateOfBirth.toISOString().split('T')[0]
                    : raw.dateOfBirth,
        };
        delete payload['confirmPassword'];
        // Omit null/undefined for optional fields so backend Zod optional() accepts
        for (const key of ['drinkingStatus', 'smokingStatus']) {
            if (payload[key] == null) delete payload[key];
        }
        this.signupPayload = payload;
        this.showOtp.set(true);
    }

    get userEmail(): string {
        return this.signupForm.get('email')?.value ?? '';
    }

    onSendOtp(): void {
        this.otpSending.set(true);
        this.otpError.set('');
        this.authService.sendOtp({ email: this.userEmail }).subscribe({
            next: () => {
                this.otpSent.set(true);
                this.otpSending.set(false);
                // Focus first OTP input after view updates
                setTimeout(() => {
                    const inputs = this.otpInputs?.toArray();
                    inputs?.[0]?.nativeElement.focus();
                }, 100);
            },
            error: () => {
                this.otpError.set('otpSendError');
                this.otpSending.set(false);
            },
        });
    }

    onOtpInput(index: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/\D/g, '');
        const digits = [...this.otpDigits()];
        digits[index] = value.charAt(0) || '';
        this.otpDigits.set(digits);
        input.value = digits[index];

        if (value && index < 5) {
            const inputs = this.otpInputs?.toArray();
            inputs?.[index + 1]?.nativeElement.focus();
        }
    }

    onOtpKeydown(index: number, event: KeyboardEvent): void {
        if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
            const inputs = this.otpInputs?.toArray();
            const prevInput = inputs?.[index - 1]?.nativeElement;
            if (prevInput) {
                const digits = [...this.otpDigits()];
                digits[index - 1] = '';
                this.otpDigits.set(digits);
                prevInput.value = '';
                prevInput.focus();
            }
        }
    }

    onOtpPaste(event: ClipboardEvent): void {
        event.preventDefault();
        const paste = event.clipboardData?.getData('text')?.replace(/\D/g, '') ?? '';
        if (paste.length === 0) return;
        const digits = [...this.otpDigits()];
        for (let i = 0; i < 6 && i < paste.length; i++) {
            digits[i] = paste[i];
        }
        this.otpDigits.set(digits);
        const inputs = this.otpInputs?.toArray();
        if (inputs) {
            inputs.forEach((inp, i) => (inp.nativeElement.value = digits[i]));
            const focusIdx = Math.min(paste.length, 5);
            inputs[focusIdx]?.nativeElement.focus();
        }
    }

    get otpComplete(): boolean {
        return this.otpDigits().every((d) => d.length === 1);
    }

    onVerifyOtp(): void {
        if (!this.otpComplete) return;
        this.otpVerifying.set(true);
        this.otpError.set('');
        const otp = this.otpDigits().join('');
        this.authService.verifyOtp({ email: this.userEmail, otp }).subscribe({
            next: () => {
                // OTP verified — now register the patient
                this.performSignup();
            },
            error: () => {
                this.otpError.set('otpError');
                this.otpVerifying.set(false);
            },
        });
    }

    private performSignup(): void {
        if (!this.signupPayload) return;
        this.patientAuthService.signup(this.signupPayload as any).subscribe({
            next: () => {
                this.otpVerifying.set(false);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Patient signup failed:', err);
                this.otpError.set('signupError');
                this.otpVerifying.set(false);
            },
        });
    }

    onBackToForm(): void {
        this.showOtp.set(false);
        this.otpSent.set(false);
        this.otpSending.set(false);
        this.otpVerifying.set(false);
        this.otpError.set('');
        this.otpDigits.set(['', '', '', '', '', '']);
    }
}
