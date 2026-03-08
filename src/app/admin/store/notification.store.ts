import { computed, inject } from '@angular/core';
import {
    signalStore,
    withState,
    withComputed,
    withMethods,
    patchState,
    withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, Subscription } from 'rxjs';
import {
    AdminNotificationsService,
    type AdminNotification,
} from '../../api/admin/applications';

interface NotificationState {
    notifications: AdminNotification[];
    panelOpen: boolean;
    sseConnected: boolean;
    lastNotification: AdminNotification | null;
}

const initialState: NotificationState = {
    notifications: [],
    panelOpen: false,
    sseConnected: false,
    lastNotification: null,
};

export const NotificationStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        unreadCount: computed(() =>
            store.notifications().filter((n) => !n.read).length,
        ),
        unreadNotifications: computed(() =>
            store.notifications().filter((n) => !n.read),
        ),
    })),
    withMethods((store, notifService = inject(AdminNotificationsService)) => {
        let sseSub: Subscription | undefined;

        return {
            // ── Panel toggle ──
            togglePanel() {
                const opening = !store.panelOpen();
                patchState(store, { panelOpen: opening });
                if (opening) {
                    this.loadUnread();
                }
            },

            closePanel() {
                patchState(store, { panelOpen: false });
            },

            // ── Load unread from API ──
            loadUnread: rxMethod<void>(
                pipe(
                    tap(() =>
                        notifService.getUnread().subscribe({
                            next: (notifs) =>
                                patchState(store, { notifications: notifs }),
                        }),
                    ),
                ),
            ),

            // ── SSE stream ──
            connectSse() {
                if (sseSub) return; // already connected
                sseSub = notifService.connectStream().subscribe({
                    next: (notif) =>
                        patchState(store, {
                            notifications: [notif, ...store.notifications()],
                            sseConnected: true,
                            lastNotification: notif,
                        }),
                    error: () => {
                        patchState(store, { sseConnected: false });
                        sseSub = undefined;
                        // fallback: reload from API
                        notifService.getUnread().subscribe({
                            next: (notifs) =>
                                patchState(store, { notifications: notifs }),
                        });
                    },
                });
                patchState(store, { sseConnected: true });
            },

            disconnectSse() {
                sseSub?.unsubscribe();
                sseSub = undefined;
                patchState(store, { sseConnected: false });
            },

            // ── Mark as read ──
            markAsRead(notif: AdminNotification) {
                if (notif.read) return;
                notifService.markAsRead(notif.id).subscribe({
                    next: () =>
                        patchState(store, {
                            notifications: store
                                .notifications()
                                .map((n) =>
                                    n.id === notif.id
                                        ? { ...n, read: true }
                                        : n,
                                ),
                        }),
                });
            },

            markAllAsRead() {
                notifService.markAllAsRead().subscribe({
                    next: () =>
                        patchState(store, {
                            notifications: store
                                .notifications()
                                .map((n) => ({ ...n, read: true })),
                        }),
                });
            },
        };
    }),
    withHooks({
        onInit(store) {
            store.loadUnread();
            store.connectSse();
        },
        onDestroy(store) {
            store.disconnectSse();
        },
    }),
);
