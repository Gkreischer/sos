import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { catchError, tap, BehaviorSubject } from 'rxjs';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';

const httpOptions = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) {}

  get users() {
    return this.usersSubject.asObservable();
  }

  getUsers() {
    return this.httpClient
      .get<User[]>(`${environment.baseUrl}/users`, {
        headers: httpOptions,
      })
      .pipe(
        tap((users) => {
          return this.usersSubject.next(users);
        }),
        catchError(this.errorService.handleError)
      );
  }

  getUser(user: User, id: number) {
    return this.httpClient
      .get<User>(`${environment.baseUrl}/users/${id}`, {
        headers: httpOptions,
      })
      .pipe(
        tap((user) => {
          return user;
        }),
        catchError(this.errorService.handleError)
      );
  }

  getUserByName(userName: string) {
    console.log(userName);
    return this.httpClient
      .post<User>(
        `${environment.baseUrl}/users/name/${userName}`,
        { name: userName },
        {
          headers: httpOptions,
        }
      )
      .pipe(
        tap((user) => {
          return user;
        }),
        catchError(this.errorService.handleError)
      );
  }
}
