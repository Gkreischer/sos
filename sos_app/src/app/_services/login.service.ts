import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { PreferencesPluginService } from './preferences-plugin.service';
import { UserLoginInterface } from '../_interfaces/UserLoginInterface';
import { UserInterface } from '../_interfaces/UserInterface';
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
      .post<UserLoginInterface>(`${environment.baseUrl}/login`, user)
      .pipe(
        tap((res) => {
          console.log(res);
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
      .post<UserInterface>(`${environment.baseUrl}/verify`, token)
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateAvatarImage(imagePath: string) {
    return this.http
      .post<UserInterface>(`${environment.baseUrl}/user/image/change`, {
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
