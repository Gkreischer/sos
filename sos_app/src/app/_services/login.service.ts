import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../_interfaces/UserInterface';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { PreferencesPluginService } from './preferences-plugin.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);
  preferencesPluginService = inject(PreferencesPluginService);
  router = inject(Router);

  userSubject: BehaviorSubject<UserInterface | null> =
    new BehaviorSubject<UserInterface | null>(null);

  get user() {
    return this.userSubject.asObservable();
  }

  public login(user: UserInterface) {
    return this.http
      .post<UserInterface>(`${environment.baseUrl}/login`, user)
      .pipe(
        tap((user) => {
          console.log(user);
          this.userSubject.next(user);
          this.setToken(user.token!);
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
      .post<UserInterface>(`${environment.baseUrl}/verify`, token)
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
