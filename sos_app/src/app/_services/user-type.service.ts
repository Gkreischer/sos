import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'shared';
import { UserTypeInterface } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {
  userTypes$ = new BehaviorSubject<UserTypeInterface[]>([]);

  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private errorService = inject(ErrorService);

  get userTypes() {
    return this.userTypes$.asObservable();
  }

  public get() {
    return this.http
      .get<UserTypeInterface[]>(`${this.baseUrl}/user-types`)
      .pipe(
        tap((userTypes) => this.userTypes$.next(userTypes)),
        catchError(this.errorService.handleError),
      );
  }
}
