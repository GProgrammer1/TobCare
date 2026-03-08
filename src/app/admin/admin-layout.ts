import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { NotificationStore } from './store/notification.store';
import type { AdminNotification } from '../api/admin/applications';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslocoModule, ButtonModule, BadgeModule],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
    readonly notifStore: InstanceType<typeof NotificationStore> = inject(NotificationStore);
    private router = inject(Router);

    sidebarCollapsed = signal(false);

    toggleSidebar() {
        this.sidebarCollapsed.update(v => !v);
    }

    toggleNotifPanel() {
        this.notifStore.togglePanel();
    }

    markAsRead(notif: AdminNotification) {
        this.notifStore.markAsRead(notif);
    }

    markAllAsRead() {
        this.notifStore.markAllAsRead();
    }

    onNotifClick(notif: AdminNotification) {
        this.notifStore.markAsRead(notif);
        const appId = notif.data?.['applicationId'] as string | undefined;
        if (appId) {
            this.router.navigate(['/admin/applications', appId]);
            this.notifStore.closePanel();
        }
    }
}
