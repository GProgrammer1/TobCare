import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './auth/guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./landing/landing').then(m => m.LandingComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent),
    },
    {
        path: 'patient/signup',
        loadComponent: () => import('./patient/auth/signup/patient-signup').then(m => m.PatientSignupComponent),
    },
    {
        path: 'doctor/apply',
        loadComponent: () => import('./doctor/auth/apply/doctor-apply').then(m => m.DoctorApplyComponent),
    },
    {
        path: 'doctor/set-password',
        loadComponent: () => import('./doctor/auth/set-password/doctor-set-password').then(m => m.DoctorSetPasswordComponent),
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin-layout').then(m => m.AdminLayoutComponent),
        canActivate: [authGuard, roleGuard('ADMIN')],
        children: [
            {
                path: '',
                redirectTo: 'applications',
                pathMatch: 'full',
            },
            {
                path: 'applications',
                loadComponent: () =>
                    import('./admin/applications/application-list').then(m => m.ApplicationListComponent),
            },
            {
                path: 'applications/:id',
                loadComponent: () =>
                    import('./admin/applications/application-detail').then(m => m.ApplicationDetailComponent),
            },
        ],
    },
];
