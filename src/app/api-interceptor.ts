import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  retry,
  shareReplay,
  switchMap,
  take,
  throwError,
  timer,
} from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './api/common/auth';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const AUTH_BYPASS_FRAGMENTS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/set-password',
];

const BACKOFF_BASE_MS = 200;
const BACKOFF_CAP_MS = 15_000;
const MAX_RETRIES = 5;

// ---------------------------------------------------------------------------
// Module-level refresh-queue state
// ---------------------------------------------------------------------------

let isRefreshing = false;
let refreshSubject$ = new BehaviorSubject<boolean | null>(null);
let consecutiveRefreshFailures = 0;

// ---------------------------------------------------------------------------
// In-flight dedup map (mutating requests only)
// ---------------------------------------------------------------------------

const inflightMutations = new Map<string, Observable<HttpEvent<unknown>>>();

function fingerprint(req: HttpRequest<unknown>): string {
  return `${req.method}:${req.urlWithParams}:${JSON.stringify(req.body) ?? ''}`;
}

// ---------------------------------------------------------------------------
// Transient-error classifier
// ---------------------------------------------------------------------------

function isTransientError(error: HttpErrorResponse): boolean {
  // status 0 = network failure / CORS / aborted
  if (error.status === 0) return true;
  if (error.status === 408) return true; // Request Timeout
  if (error.status === 429) return true; // Too Many Requests
  if (error.status >= 500) return true;  // Server errors
  return false;
}

// ---------------------------------------------------------------------------
// Full-jitter exponential backoff delay
// ---------------------------------------------------------------------------

function jitteredDelay(retryIndex: number): Observable<0> {
  const expDelay = Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** (retryIndex - 1));
  const jittered = Math.floor(Math.random() * expDelay);
  return timer(jittered);
}

// ---------------------------------------------------------------------------
// apiInterceptor — URL rewrite + credentials + idempotency key
// ---------------------------------------------------------------------------

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsoluteUrl =
    req.url.startsWith('http://') || req.url.startsWith('https://');
  const isI18n =
    req.url.startsWith('/i18n/') || req.url.includes('/i18n/');
  const url =
    isAbsoluteUrl || isI18n
      ? req.url
      : `${environment.apiUrl.replace(/\/$/, '')}/${req.url.replace(/^\//, '')}`;

  let headers = req.headers;
  if (MUTATING_METHODS.has(req.method)) {
    headers = headers.set('X-Idempotency-Key', crypto.randomUUID());
  }

  const cloned = req.clone({ url, headers, withCredentials: true });
  return next(cloned);
};

// ---------------------------------------------------------------------------
// authInterceptor — dedup ▸ backoff ▸ 401 refresh queue
// ---------------------------------------------------------------------------

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ── Layer A: In-flight dedup (mutating requests only) ──────────────
  let source$: Observable<HttpEvent<unknown>>;

  if (MUTATING_METHODS.has(req.method)) {
    const key = fingerprint(req);
    const existing = inflightMutations.get(key);
    if (existing) {
      return existing;
    }
    const shared$ = next(req).pipe(
      shareReplay(1),
      finalize(() => inflightMutations.delete(key)),
    );
    inflightMutations.set(key, shared$);
    source$ = shared$;
  } else {
    source$ = next(req);
  }

  // ── Layer B: Exponential backoff with full jitter ──────────────────
  const withRetry$ = source$.pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // 401 is handled by Layer C, don't retry here
        if (error.status === 401) {
          throw error;
        }
        // Non-transient (user-induced) → throw immediately
        if (!isTransientError(error)) {
          throw error;
        }
        return jitteredDelay(retryCount);
      },
    }),
  );

  // ── Layer C: 401 refresh queue ─────────────────────────────────────
  return withRetry$.pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401s that aren't auth endpoints themselves
      if (
        error.status !== 401 ||
        AUTH_BYPASS_FRAGMENTS.some((frag) => req.url.includes(frag))
      ) {
        return throwError(() => error);
      }

      // Too many consecutive refresh failures — cut the queue, go to login
      if (consecutiveRefreshFailures > 1) {
        router.navigate(['/login']);
        return throwError(() => error);
      }

      // Another interceptor call is already refreshing — queue behind it
      if (isRefreshing) {
        return refreshSubject$.pipe(
          filter((value) => value !== null),
          take(1),
          switchMap((success) =>
            success ? next(req) : throwError(() => error),
          ),
        );
      }

      // We are the first — initiate the refresh
      isRefreshing = true;
      refreshSubject$ = new BehaviorSubject<boolean | null>(null);

      return authService.refresh().pipe(
        switchMap(() => {
          isRefreshing = false;
          consecutiveRefreshFailures = 0;
          refreshSubject$.next(true);
          return next(req);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          consecutiveRefreshFailures++;
          refreshSubject$.next(false);
          router.navigate(['/login']);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
