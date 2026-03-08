import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface EmergencyContactPayload {
    name: string
    phoneNumber: string
}

export interface DiseasePayload {
    name: string
    diagnosedYear: number
    diagnosedMonth: number
}

export interface AllergyPayload {
    name: string
    diagnosedYear: number
    diagnosedMonth: number
    severity: string
}

export interface MedicationPayload {
    name: string
    dose: string
    frequency: string
    prescribedYear: number
    prescribedMonth: number
    allergy?: AllergyPayload
    disease?: DiseasePayload
}

export interface PatientSignupPayload {
    firstName: string
    lastName: string
    email: string
    password: string
    role: 'PATIENT'
    phoneNumber: string  
    dateOfBirth: string
    heightCm: number
    weightKg: number
    gender: string
    bloodType: string
    drinkingStatus?: string
    smokingStatus?: string
    emergencyContacts?: EmergencyContactPayload[]
    diseases?: DiseasePayload[]
    allergies?: AllergyPayload[]
    medications?: MedicationPayload[]
}

@Injectable({ providedIn: 'root' })
export class PatientAuthService {
    private prefix = 'patient/auth';

    constructor(private http: HttpClient) {}

    signup(payload: PatientSignupPayload) {
        return this.http.post(`${this.prefix}/signup`, payload)
    }
}
