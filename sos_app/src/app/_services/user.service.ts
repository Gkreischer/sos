import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { catchError, tap, BehaviorSubject } from 'rxjs';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';

const httpOptions = new HttpHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
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

  updateUser(user: User, id: number) {
    console.log(`${environment.baseUrl}/users/${id}`)
    return this.httpClient
      .put<User>(`${environment.baseUrl}/users/${id}`, user, {
        headers: httpOptions,
      })
      .pipe(
        tap((userReceived) => {
          const newUsers = this.usersSubject.value.map((user) => {
            if (user.id === userReceived.id) {
              return userReceived;
            }
            return user;
          })

          return this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError)
      );
    
  }

  deleteUser(user: User) {
    return this.httpClient
      .delete(`${environment.baseUrl}/users/${user.id}`, {
        headers: httpOptions,
      })
      .pipe(
        tap(() => {
          const newUsers = this.usersSubject.value.filter(
            (userListItem) => userListItem.id !== user.id
          );
          this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError)
      );
  }
}
