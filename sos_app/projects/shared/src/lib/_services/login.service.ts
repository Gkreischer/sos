import { Injectable, inject, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { PreferencesPluginService } from './preferences-plugin.service';
import { UserLoginInterface } from './../_interfaces/UserLoginInterface';
import { UserInterface } from './../_interfaces/UserInterface';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { NotificationInterface } from './../_interfaces/NotificationInterface';
import { APP_CONFIG } from '../config/app.config';
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

  userSubject: BehaviorSubject<UserInterface | null> =
    new BehaviorSubject<UserInterface | null>(null);

  get user() {
    return this.userSubject.asObservable();
  }

  public login(user: UserInterface) {
    return this.http
      .post<UserLoginInterface>(`${this.appConfig.baseUrl}/login`, user)
      .pipe(
        tap((res) => {
          res.user ? this.userSubject.next(res.user) : null;
          this.setToken(res.token!);
        }),
        catchError(this.errorService.handleError),
      );
  }

  private async setToken(token: string) {
    return await this.preferencesPluginService.set('_t', token);
  }

  logout() {
    this.preferencesPluginService.remove('_t');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  verifyToken(token: string) {
    return this.http
      .post<UserInterface>(`${this.appConfig.baseUrl}/verify`, token)
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
          this.notificationService.listen<NotificationInterface>(
            'notifications',
            '.new.notification',
            (data) => {},
          );
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateAvatarImage(imagePath: string) {
    return this.http
      .post<UserInterface>(`${this.appConfig.baseUrl}/user/image/change`, {
        imagePath: imagePath,
      })
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
