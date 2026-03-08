import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface ApplicationListQuery {
    cursor?: string;
    limit?: number;
    status?: string;
    search?: string;
}

export interface ApplicationMeta {
    hasMore: boolean;
    nextCursor: string | null;
    limit: number;
}

export interface Clinic {
    id: string;
    name: string;
    address?: string;
    governorate: string;
    consultationFee?: number;
}

export interface Hospital {
    id: string;
    name: string;
    address?: string;
    governorate: string;
}

export interface DoctorApplication {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationalIdNumber: string;
    lopNumber: string;
    mophLicenseNumber: string;
    specialties: string[];
    isSpecialist: boolean;
    graduationCountry: string;
    medicalSchool: string;
    graduationYear: number;
    clinics: Clinic[];
    hospitals: Hospital[];
    acceptedInsurances: string[];
    nationalIdDoc: string;
    lopCertificateDoc: string;
    medicalDegreeDoc: string;
    mophLicenseDoc: string;
    specialtyDocs: string[];
    colloquiumDoc?: string;
    criminalRecordDoc: string;
    passportPhotoDoc: string;
    status: string;
    verifiedAt?: string;
    verifiedBy?: string;
    adminNotes?: string;
}

export interface ApplicationListResponse {
    data: DoctorApplication[];
    meta: ApplicationMeta;
}

export interface StatusCounts {
    pending: number;
    verified: number;
    rejected: number;
    suspended: number;
    total: number;
}

export interface UpdateStatusPayload {
    status: string;
    adminNotes?: string;
}

export interface AdminNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    read: boolean;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApplicationsService {
    private prefix = 'admin/applications';

    constructor(private http: HttpClient) {}

    list(query: ApplicationListQuery = {}) {
        let params = new HttpParams();
        if (query.cursor) params = params.set('cursor', query.cursor);
        if (query.limit) params = params.set('limit', query.limit);
        if (query.status) params = params.set('status', query.status);
        if (query.search) params = params.set('search', query.search);
        return this.http.get<ApplicationListResponse>(this.prefix, { params });
    }

    getById(id: string) {
        return this.http.get<DoctorApplication>(`${this.prefix}/${id}`);
    }

    updateStatus(id: string, payload: UpdateStatusPayload) {
        return this.http.patch<DoctorApplication>(`${this.prefix}/${id}/status`, payload);
    }

    getStatusCounts() {
        return this.http.get<StatusCounts>(`${this.prefix}/counts`);
    }
}

@Injectable({ providedIn: 'root' })
export class AdminNotificationsService {
    private prefix = 'admin/notifications';

    constructor(
        private http: HttpClient,
        private ngZone: NgZone,
    ) {}

    getUnread() {
        return this.http.get<AdminNotification[]>(this.prefix);
    }

    getUnreadCount() {
        return this.http.get<{ count: number }>(`${this.prefix}/count`);
    }

    markAsRead(id: string) {
        return this.http.patch<AdminNotification>(`${this.prefix}/${id}/read`, {});
    }

    markAllAsRead() {
        return this.http.patch<{ success: boolean }>(`${this.prefix}/read-all`, {});
    }

    /**
     * Connect to SSE stream with automatic reconnect and exponential backoff.
     */
    connectStream(): Observable<AdminNotification> {
        return new Observable(subscriber => {
            let eventSource: EventSource | null = null;
            let retryCount = 0;
            const maxRetry = 5;
            let retryTimeout: ReturnType<typeof setTimeout>;

            const connect = () => {
                const url = `${environment.apiUrl}/${this.prefix}/stream`;
                eventSource = new EventSource(url);

                eventSource.addEventListener('notification', (event: MessageEvent) => {
                    this.ngZone.run(() => {
                        try {
                            const notification = JSON.parse(event.data) as AdminNotification;
                            subscriber.next(notification);
                        } catch {
                            // ignore parse errors
                        }
                    });
                });

                eventSource.onopen = () => {
                    retryCount = 0; // reset on successful connection
                };

                eventSource.onerror = () => {
                    eventSource?.close();
                    eventSource = null;

                    if (retryCount < maxRetry) {
                        const delay = Math.min(1000 * 2 ** retryCount, 30000);
                        retryCount++;
                        retryTimeout = setTimeout(() => connect(), delay);
                    } else {
                        subscriber.error(new Error('SSE max retries exceeded'));
                    }
                };
            };

            connect();

            return () => {
                clearTimeout(retryTimeout);
                eventSource?.close();
                eventSource = null;
            };
        });
    }
}
