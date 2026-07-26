import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'shared';
import { BehaviorSubject, tap, catchError } from 'rxjs';
import { APP_CONFIG } from 'shared';
import { UserInterface } from 'shared';
import { LoginService } from 'shared';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  appConfig = inject(APP_CONFIG);

  http = inject(HttpClient);
  errorService = inject(ErrorService);
  loginService = inject(LoginService);

  updateAvatarImage(imagePath: string) {
    return this.http
      .post<UserInterface>(`${this.appConfig.baseUrl}/user/image/change`, {
        imagePath: imagePath,
      })
      .pipe(
        tap((user) => {
          this.loginService.userSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateUser(user: UserInterface) {
    return this.http
      .put<UserInterface>(`${this.appConfig.baseUrl}/users/${user.id}`, user)
      .pipe(
        tap((user) => {
          this.loginService.userSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
