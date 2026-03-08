import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogModule } from 'primeng/dialog';
import {
    AdminApplicationsService,
    type DoctorApplication,
} from '../../api/admin/applications';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-application-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TagModule,
        ButtonModule,
        TextareaModule,
        TranslocoModule,
        DialogModule,
    ],
    templateUrl: './application-detail.html',
    styleUrl: './application-detail.scss',
})
export class ApplicationDetailComponent implements OnInit {
    application = signal<DoctorApplication | null>(null);
    loading = signal(true);
    actionLoading = signal(false);

    showDialog = signal(false);
    dialogAction = signal<'VERIFIED' | 'REJECTED'>('VERIFIED');
    adminNotes = '';

    constructor(
        private adminService: AdminApplicationsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadApplication(id);
        }
    }

    loadApplication(id: string) {
        this.loading.set(true);
        this.adminService.getById(id).subscribe({
            next: (app) => {
                this.application.set(app);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.router.navigate(['/admin/applications']);
            },
        });
    }

    goBack() {
        this.router.navigate(['/admin/applications']);
    }

    openApproveDialog() {
        this.dialogAction.set('VERIFIED');
        this.adminNotes = '';
        this.showDialog.set(true);
    }

    openRejectDialog() {
        this.dialogAction.set('REJECTED');
        this.adminNotes = '';
        this.showDialog.set(true);
    }

    confirmAction() {
        const app = this.application();
        if (!app) return;

        this.actionLoading.set(true);
        this.adminService
            .updateStatus(app.id, {
                status: this.dialogAction(),
                adminNotes: this.adminNotes || undefined,
            })
            .subscribe({
                next: (updated) => {
                    this.application.set(updated);
                    this.showDialog.set(false);
                    this.actionLoading.set(false);
                },
                error: () => this.actionLoading.set(false),
            });
    }

    getStatusSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
        switch (status) {
            case 'VERIFIED': return 'success';
            case 'PENDING': return 'warn';
            case 'REJECTED': return 'danger';
            case 'SUSPENDED': return 'secondary';
            default: return 'info';
        }
    }

    getDocLabel(field: string): string {
        const labels: Record<string, string> = {
            nationalIdDoc: 'National ID',
            lopCertificateDoc: 'LOP Certificate',
            medicalDegreeDoc: 'Medical Degree',
            mophLicenseDoc: 'MOPH License',
            colloquiumDoc: 'Colloquium',
            criminalRecordDoc: 'Criminal Record',
            passportPhotoDoc: 'Passport Photo',
        };
        return labels[field] ?? field;
    }

    /** Base URL of the backend (e.g. http://localhost:3000) for resolving uploaded file paths */
    private readonly backendOrigin = environment.apiUrl.replace(/\/api\/.*$/, '');

    resolveFileUrl(path: string): string {
        return path.startsWith('http') ? path : `${this.backendOrigin}${path}`;
    }

    getSingleDocs(): { label: string; url: string }[] {
        const app = this.application();
        if (!app) return [];
        const fields = [
            'nationalIdDoc', 'lopCertificateDoc', 'medicalDegreeDoc',
            'mophLicenseDoc', 'colloquiumDoc', 'criminalRecordDoc', 'passportPhotoDoc',
        ] as const;
        return fields
            .filter(f => (app as unknown as Record<string, unknown>)[f])
            .map(f => ({ label: this.getDocLabel(f), url: this.resolveFileUrl((app as unknown as Record<string, unknown>)[f] as string) }));
    }
}
