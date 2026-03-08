import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface UserSignupPayload {
    email: string
    firstName: string
    lastName: string
    password: string
}

export interface SendOtpPayload {
    email: string
}

export interface VerifyOtpPayload {
    email: string
    otp: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
}

export interface MeResponse {
    userId: string
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private prefix: string;

    constructor(private http: HttpClient){
        this.prefix = 'auth'
    }

    userSignup(userSignupPayload: UserSignupPayload) {
        return this.http.post(`${this.prefix}/signup`, userSignupPayload)
    }

    sendOtp(payload: SendOtpPayload) {
        return this.http.post<{ message: string }>(`${this.prefix}/send-otp`, payload)
    }

    verifyOtp(payload: VerifyOtpPayload) {
        return this.http.post<{ message: string }>(`${this.prefix}/verify-otp`, payload)
    }

    login(payload: LoginPayload) {
        return this.http.post<LoginResponse>(`${this.prefix}/login`, payload)
    }

    logout() {
        return this.http.post<{ message: string }>(`${this.prefix}/logout`, {})
    }

    refresh() {
        return this.http.post<LoginResponse>(`${this.prefix}/refresh`, {})
    }

    me() {
        return this.http.get<MeResponse>(`${this.prefix}/me`)
    }
}