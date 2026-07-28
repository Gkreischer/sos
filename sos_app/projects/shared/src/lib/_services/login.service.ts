import { Injectable, inject, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { BehaviorSubject, tap, catchError, switchMap, map, from } from 'rxjs';
import { PreferencesPluginService } from './preferences-plugin.service';
import { UserLoginInterface } from './../_interfaces/UserLoginInterface';
import { UserInterface } from './../_interfaces/UserInterface';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { NotificationInterface } from './../_interfaces/NotificationInterface';
import { APP_CONFIG } from '../config/app.config';
import { Observable, of, throwError, shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  appConfig = inject(APP_CONFIG);

  http = inject(HttpClient);
  errorService = inject(ErrorService);
  preferencesPluginService = inject(PreferencesPluginService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  private userLoaded = false;
  private loadingUser$?: Observable<UserInterface | null>;

  userSubject: BehaviorSubject<UserInterface | null> =
    new BehaviorSubject<UserInterface | null>(null);

  get user() {
    return this.userSubject.asObservable();
  }

  login(credentials: UserInterface) {
    return this.getCRSFCookie().pipe(
      switchMap(() =>
        this.http.post<UserLoginInterface>(
          `${this.appConfig.baseUrl}/login`,
          credentials,
        ),
      ),
      tap((res) => {
        if (res.user) {
          this.userLoaded = true;
          this.userSubject.next(res.user);

          this.notificationService.listen<NotificationInterface>(
            'notifications',
            '.new.notification',
            () => {},
          );
        }
      }),
      catchError(this.errorService.handleError),
    );
  }

  loadUser() {
    if (this.userLoaded) {
      return of(this.userSubject.value);
    }

    if (this.loadingUser$) {
      return this.loadingUser$;
    }

    this.loadingUser$ = this.http
      .get<UserInterface>(`${this.appConfig.baseUrl}/user/verify`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.userLoaded = true;
          this.userSubject.next(user);
        }),
        catchError((error) => {
          this.userLoaded = true;
          this.userSubject.next(null);
          return throwError(() => error);
        }),
        shareReplay(1),
      );

    return this.loadingUser$;
  }

  logout() {
    return this.http.post(`${this.appConfig.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      }),
      catchError(this.errorService.handleError),
    );
  }

  getCRSFCookie() {
    return this.http.get(`/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  updateUserPassword(user: UserInterface) {
    return this.http
      .put<UserInterface>(`${this.appConfig.baseUrl}/user/password`, user)
      .pipe(catchError(this.errorService.handleError));
  }
}
