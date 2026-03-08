import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, type MeResponse } from '../api/common/auth';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private _user = signal<MeResponse | null>(null);
  private _checked = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly role = computed(() => this._user()?.role ?? null);
  readonly checked = this._checked.asReadonly();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /** Call on app init or when needed to check current auth status via the /me endpoint */
  checkAuth() {
    return this.authService.me().pipe(
      tap((user) => {
        this._user.set(user);
        this._checked.set(true);
      }),
      catchError(() => {
        this._user.set(null);
        this._checked.set(true);
        return of(null);
      }),
    );
  }

  /** Set user after successful login */
  setUser(role: 'ADMIN' | 'DOCTOR' | 'PATIENT', userId?: string) {
    this._user.set({ userId: userId ?? '', role });
    this._checked.set(true);
  }

  /** Clear user state on logout */
  clear() {
    this._user.set(null);
  }

  /** Login, set state, and redirect based on role */
  loginAndRedirect(email: string, password: string) {
    return this.authService.login({ email, password }).pipe(
      tap((res) => {
        this.setUser(res.role);
        this.redirectByRole(res.role);
      }),
    );
  }

  /** Logout, clear state, and redirect to login */
  logoutAndRedirect() {
    return this.authService.logout().pipe(
      tap(() => {
        this.clear();
        this.router.navigate(['/login']);
      }),
      catchError(() => {
        this.clear();
        this.router.navigate(['/login']);
        return of(null);
      }),
    );
  }

  private redirectByRole(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor/dashboard']);
        break;
      case 'PATIENT':
        this.router.navigate(['/patient/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
