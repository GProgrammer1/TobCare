import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TranslocoModule } from '@jsverse/transloco';
import {
    AdminApplicationsService,
    type DoctorApplication,
    type ApplicationMeta,
    type StatusCounts,
} from '../../api/admin/applications';
import { NotificationStore } from '../store/notification.store';

@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        TranslocoModule,
    ],
    templateUrl: './application-list.html',
    styleUrl: './application-list.scss',
})
export class ApplicationListComponent implements OnInit {
    applications = signal<DoctorApplication[]>([]);
    meta = signal<ApplicationMeta>({ hasMore: false, nextCursor: null, limit: 10 });
    counts = signal<StatusCounts>({ pending: 0, verified: 0, rejected: 0, suspended: 0, total: 0 });
    loading = signal(true);
    loadingMore = signal(false);

    searchQuery = '';
    selectedStatus = '';

    statusOptions = [
        { label: 'All', value: '' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Verified', value: 'VERIFIED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Suspended', value: 'SUSPENDED' },
    ];

    private notificationStore = inject(NotificationStore);

    constructor(
        private adminService: AdminApplicationsService,
        private router: Router,
    ) {
        effect(() => {
            const notif = this.notificationStore.lastNotification();
            if (notif?.type === 'NEW_APPLICATION') {
                this.loadCounts();
                this.loadApplications();
            }
        });
    }

    ngOnInit() {
        this.loadCounts();
        this.loadApplications();
    }

    loadCounts() {
        this.adminService.getStatusCounts().subscribe({
            next: (counts) => this.counts.set(counts),
        });
    }

    loadApplications() {
        this.loading.set(true);
        this.adminService
            .list({
                limit: 10,
                status: this.selectedStatus || undefined,
                search: this.searchQuery || undefined,
            })
            .subscribe({
                next: (res) => {
                    this.applications.set(res.data);
                    this.meta.set(res.meta);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false),
            });
    }

    loadMore() {
        const cursor = this.meta().nextCursor;
        if (!cursor) return;
        this.loadingMore.set(true);
        this.adminService
            .list({
                cursor,
                limit: 10,
                status: this.selectedStatus || undefined,
                search: this.searchQuery || undefined,
            })
            .subscribe({
                next: (res) => {
                    this.applications.update(current => [...current, ...res.data]);
                    this.meta.set(res.meta);
                    this.loadingMore.set(false);
                },
                error: () => this.loadingMore.set(false),
            });
    }

    onSearch() {
        this.loadApplications();
    }

    onStatusFilter() {
        this.loadApplications();
    }

    viewApplication(app: DoctorApplication) {
        this.router.navigate(['/admin/applications', app.id]);
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

    getFullName(app: DoctorApplication): string {
        return `${app.firstName} ${app.lastName}`;
    }
}
