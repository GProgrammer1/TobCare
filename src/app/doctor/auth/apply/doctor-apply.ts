import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormsModule,
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { TranslocoModule } from '@jsverse/transloco';
import { DoctorAuthService } from '../../../api/doctor/auth';

/* ── Governorate options (matching backend Prisma enum) ── */
export const GOVERNORATE_OPTIONS = [
    { label: 'Beirut', value: 'BEIRUT' },
    { label: 'Mount Lebanon', value: 'MOUNT_LEBANON' },
    { label: 'North', value: 'NORTH' },
    { label: 'South', value: 'SOUTH' },
    { label: 'Bekaa', value: 'BEKAA' },
    { label: 'Nabatieh', value: 'NABATIEH' },
    { label: 'Akkar', value: 'AKKAR' },
    { label: 'Baalbek-Hermel', value: 'BAALBEK_HERMEL' },
];

/** Single-file document fields */
const SINGLE_DOC_FIELDS = [
    'nationalIdDoc',
    'lopCertificateDoc',
    'medicalDegreeDoc',
    'mophLicenseDoc',
    'colloquiumDoc',
    'criminalRecordDoc',
    'passportPhotoDoc',
] as const;

/** Required single-file document fields */
const REQUIRED_DOC_FIELDS = [
    'nationalIdDoc',
    'lopCertificateDoc',
    'medicalDegreeDoc',
    'criminalRecordDoc',
    'passportPhotoDoc',
] as const;

@Component({
    selector: 'app-doctor-apply',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        InputTextModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        InputNumberModule,
        CheckboxModule,
        ChipModule,
        TranslocoModule,
    ],
    templateUrl: './doctor-apply.html',
    styleUrl: './doctor-apply.scss',
})
export class DoctorApplyComponent {
    currentStep = signal(1);
    totalSteps = 5;
    submitting = signal(false);
    submitError = signal('');
    submitSuccess = signal(false);

    today = new Date();
    governorateOptions = GOVERNORATE_OPTIONS;

    /* ── File state (managed outside reactive form) ── */
    selectedFiles: Record<string, File | null> = {};
    specialtyDocsFiles: File[] = [];
    fileErrors: Record<string, string> = {};

    /* ── Specialty chip input ── */
    specialtyInput = '';

    applyForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private doctorAuthService: DoctorAuthService,
        private router: Router,
    ) {
        this.applyForm = this.fb.group({
            /* — Step 1: Personal Info — */
            firstName: ['', [Validators.required, Validators.minLength(1)]],
            lastName: ['', [Validators.required, Validators.minLength(1)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
            dateOfBirth: [null, [Validators.required]],

            /* — Step 2: Professional Info — */
            nationalIdNumber: ['', [Validators.required, Validators.minLength(1)]],
            lopNumber: ['', [Validators.required, Validators.minLength(1)]],
            mophLicenseNumber: ['', [Validators.required, Validators.minLength(1)]],
            isSpecialist: [false],
            specialties: [[] as string[], [Validators.required, this.minArrayLength(1)]],
            graduationCountry: ['', [Validators.required, Validators.minLength(1)]],
            medicalSchool: ['', [Validators.required, Validators.minLength(1)]],
            graduationYear: [null, [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear())]],

            /* — Step 3: Practice Locations — */
            clinics: this.fb.array([]),
            hospitals: this.fb.array([]),
            acceptedInsurances: [[] as string[]],
        });
    }

    /* ── Custom validator for min array length ── */
    private minArrayLength(min: number) {
        return (control: { value: unknown[] }) => {
            return control.value && control.value.length >= min ? null : { minArrayLength: { min } };
        };
    }

    /* ── Helpers ── */
    get f() {
        return this.applyForm.controls;
    }

    currentYear(): number {
        return new Date().getFullYear();
    }

    /* ── FormArray getters ── */
    get clinics(): FormArray {
        return this.applyForm.get('clinics') as FormArray;
    }

    get hospitals(): FormArray {
        return this.applyForm.get('hospitals') as FormArray;
    }

    /* ── Clinic CRUD ── */
    addClinic(): void {
        this.clinics.push(
            this.fb.group({
                name: ['', [Validators.required, Validators.minLength(1)]],
                address: [''],
                governorate: [null, [Validators.required]],
                consultationFee: [null],
            }),
        );
    }

    removeClinic(i: number): void {
        this.clinics.removeAt(i);
    }

    /* ── Hospital CRUD ── */
    addHospital(): void {
        this.hospitals.push(
            this.fb.group({
                name: ['', [Validators.required, Validators.minLength(1)]],
                address: ['', [Validators.required, Validators.minLength(1)]],
                governorate: [null, [Validators.required]],
            }),
        );
    }

    removeHospital(i: number): void {
        this.hospitals.removeAt(i);
    }

    /* ── Specialty chips ── */
    get specialtiesList(): string[] {
        return this.applyForm.get('specialties')?.value ?? [];
    }

    addSpecialty(): void {
        const value = this.specialtyInput.trim();
        if (!value) return;
        const current = [...this.specialtiesList];
        if (!current.includes(value)) {
            current.push(value);
            this.applyForm.get('specialties')?.setValue(current);
        }
        this.specialtyInput = '';
    }

    onSpecialtyKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.addSpecialty();
        }
    }

    removeSpecialty(index: number): void {
        const current = [...this.specialtiesList];
        current.splice(index, 1);
        this.applyForm.get('specialties')?.setValue(current);
    }

    /* ── Insurance chips ── */
    insuranceInput = '';

    get insurancesList(): string[] {
        return this.applyForm.get('acceptedInsurances')?.value ?? [];
    }

    addInsurance(): void {
        const value = this.insuranceInput.trim();
        if (!value) return;
        const current = [...this.insurancesList];
        if (!current.includes(value)) {
            current.push(value);
            this.applyForm.get('acceptedInsurances')?.setValue(current);
        }
        this.insuranceInput = '';
    }

    onInsuranceKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.addInsurance();
        }
    }

    removeInsurance(index: number): void {
        const current = [...this.insurancesList];
        current.splice(index, 1);
        this.applyForm.get('acceptedInsurances')?.setValue(current);
    }

    /* ── File handling ── */
    onFileSelected(field: string, event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.selectedFiles[field] = input.files[0];
            delete this.fileErrors[field];
        }
    }

    onFileDrop(field: string, event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            this.selectedFiles[field] = file;
            delete this.fileErrors[field];
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    removeFile(field: string): void {
        this.selectedFiles[field] = null;
    }

    getFileName(field: string): string | null {
        return this.selectedFiles[field]?.name ?? null;
    }

    /* Specialty docs (array) */
    onSpecialtyDocsSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                this.specialtyDocsFiles.push(input.files[i]);
            }
            delete this.fileErrors['specialtyDocs'];
        }
    }

    onSpecialtyDocsDrop(event: DragEvent): void {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.specialtyDocsFiles.push(files[i]);
            }
            delete this.fileErrors['specialtyDocs'];
        }
    }

    removeSpecialtyDoc(index: number): void {
        this.specialtyDocsFiles.splice(index, 1);
    }

    /* ── Step‑field mapping for per‑step validation ── */
    private stepFields: Record<number, string[]> = {
        1: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
        2: ['nationalIdNumber', 'lopNumber', 'mophLicenseNumber', 'specialties', 'graduationCountry', 'medicalSchool', 'graduationYear'],
        3: ['clinics', 'hospitals'],
        4: [], // file validation handled separately
        5: [], // review step
    };

    private isStepValid(step: number): boolean {
        if (step === 3) {
            // At least one clinic or hospital
            if (this.clinics.length === 0 && this.hospitals.length === 0) return false;
            // All existing clinics/hospitals must be valid
            const clinicsValid = this.clinics.controls.every(c => c.valid);
            const hospitalsValid = this.hospitals.controls.every(h => h.valid);
            return clinicsValid && hospitalsValid;
        }
        if (step === 4) {
            return this.areRequiredDocsSelected();
        }
        const fields = this.stepFields[step] || [];
        return fields.every((name) => {
            const ctrl = this.applyForm.get(name);
            return ctrl ? ctrl.valid : true;
        });
    }

    private areRequiredDocsSelected(): boolean {
        for (const field of REQUIRED_DOC_FIELDS) {
            if (!this.selectedFiles[field]) return false;
        }
        if (this.specialtyDocsFiles.length === 0) return false;
        return true;
    }

    private markStepTouched(step: number): void {
        if (step === 3) {
            this.clinics.controls.forEach(group => {
                if (group instanceof FormGroup) {
                    Object.values(group.controls).forEach(c => c.markAsTouched());
                }
            });
            this.hospitals.controls.forEach(group => {
                if (group instanceof FormGroup) {
                    Object.values(group.controls).forEach(c => c.markAsTouched());
                }
            });
            return;
        }
        if (step === 4) {
            // Mark file errors for required docs
            for (const field of REQUIRED_DOC_FIELDS) {
                if (!this.selectedFiles[field]) {
                    this.fileErrors[field] = 'required';
                }
            }
            if (this.specialtyDocsFiles.length === 0) {
                this.fileErrors['specialtyDocs'] = 'required';
            }
            return;
        }
        const fields = this.stepFields[step] || [];
        fields.forEach((name) => {
            const ctrl = this.applyForm.get(name);
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
                this.onSubmit();
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

    hasLocationError(): boolean {
        return this.clinics.length === 0 && this.hospitals.length === 0;
    }

    /* ── Submit ── */
    private onSubmit(): void {
        if (this.submitting()) return;
        this.submitting.set(true);
        this.submitError.set('');

        const formData = new FormData();
        const raw = this.applyForm.value;

        // Text fields
        formData.append('firstName', raw.firstName);
        formData.append('lastName', raw.lastName);
        formData.append('email', raw.email);
        formData.append('phone', raw.phone);
        formData.append('dateOfBirth',
            raw.dateOfBirth instanceof Date
                ? raw.dateOfBirth.toISOString().split('T')[0]
                : raw.dateOfBirth,
        );
        formData.append('nationalIdNumber', raw.nationalIdNumber);
        formData.append('lopNumber', raw.lopNumber);
        formData.append('mophLicenseNumber', raw.mophLicenseNumber);
        formData.append('isSpecialist', String(raw.isSpecialist ?? false));
        formData.append('graduationCountry', raw.graduationCountry);
        formData.append('medicalSchool', raw.medicalSchool);
        formData.append('graduationYear', String(raw.graduationYear));

        // Array text fields
        for (const s of raw.specialties ?? []) {
            formData.append('specialties', s);
        }
        for (const ins of raw.acceptedInsurances ?? []) {
            formData.append('acceptedInsurances', ins);
        }

        // Clinics & Hospitals as JSON
        if (raw.clinics?.length) {
            formData.append('clinics', JSON.stringify(raw.clinics));
        }
        if (raw.hospitals?.length) {
            formData.append('hospitals', JSON.stringify(raw.hospitals));
        }

        // Single file fields
        for (const field of SINGLE_DOC_FIELDS) {
            const file = this.selectedFiles[field];
            if (file) {
                formData.append(field, file, file.name);
            }
        }

        // Specialty docs (array)
        for (const file of this.specialtyDocsFiles) {
            formData.append('specialtyDocs', file, file.name);
        }

        this.doctorAuthService.apply(formData).subscribe({
            next: () => {
                this.submitting.set(false);
                this.submitSuccess.set(true);
            },
            error: (err) => {
                console.error('Doctor application failed:', err);
                this.submitError.set('submitError');
                this.submitting.set(false);
            },
        });
    }
}
