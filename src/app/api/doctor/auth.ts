import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DoctorAuthService {
    private prefix = 'doctor/auth';

    constructor(private http: HttpClient) {}

    apply(formData: FormData) {
        return this.http.post(`${this.prefix}/apply`, formData);
    }

    setPassword(payload: { token: string; password: string }) {
        return this.http.post<{ message: string }>(`${this.prefix}/set-password`, payload);
    }
}
