import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { catchError, tap, BehaviorSubject } from 'rxjs';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
  ) {}

  get users() {
    return this.usersSubject.asObservable();
  }

  getUsers() {
    return this.httpClient
      .get<User[]>(`${environment.baseUrl}/users`, httpOptions)
      .pipe(
        tap((users) => {
          return this.usersSubject.next(users);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getUserByDesc(description: string) {
    return this.httpClient
      .post<
        User[]
      >(`${environment.baseUrl}/users/description/${description}`, description, httpOptions)
      .pipe(
        tap((user) => {
          return this.usersSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }

  addUser(user: User) {
    return this.httpClient
      .post<User>(`${environment.baseUrl}/users/add`, user, httpOptions)
      .pipe(
        tap((userReceived) => {
          const newUsers = [userReceived, ...this.usersSubject.value];
          return this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateUser(user: User, id: number) {
    console.log(`${environment.baseUrl}/users/${id}`);
    return this.httpClient
      .put<User>(`${environment.baseUrl}/users/${id}`, user, httpOptions)
      .pipe(
        tap((userReceived) => {
          const newUsers = this.usersSubject.value.map((user) => {
            if (user.id === userReceived.id) {
              return userReceived;
            }
            return user;
          });

          return this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError),
      );
  }

  deleteUser(user: User) {
    return this.httpClient
      .delete(`${environment.baseUrl}/users/${user.id}`, httpOptions)
      .pipe(
        tap(() => {
          const newUsers = this.usersSubject.value.filter(
            (userListItem) => userListItem.id !== user.id,
          );
          this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
