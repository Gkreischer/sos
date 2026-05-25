import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../_interfaces/UserInterface';
import { catchError, tap, BehaviorSubject } from 'rxjs';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { PaginateInterface } from '../_interfaces/PaginateInterface';
import { UserTypeInterface } from '../_interfaces/UserTypeInterface';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersSubject = new BehaviorSubject<UserInterface[]>([]);
  userTypesSubject = new BehaviorSubject<UserTypeInterface[]>([]);

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService,
  ) {}

  get users() {
    return this.usersSubject.asObservable();
  }

  get userTypes() {
    return this.userTypesSubject.asObservable();
  }

  getUsers(page?: number) {
    return this.httpClient
      .get<
        PaginateInterface<UserInterface[]>
      >(`${environment.baseUrl}/users${page ? `?page=${page}` : ''}`, httpOptions)
      .pipe(
        tap((res) => {
          return this.usersSubject.next([
            ...this.usersSubject.value,
            ...res.data,
          ]);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getUserByDesc(filter: UserTypeInterface) {
    return this.httpClient
      .post<
        UserInterface[]
      >(`${environment.baseUrl}/users/description/${filter.id}`, filter, httpOptions)
      .pipe(
        tap((user) => {
          return this.usersSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }

  addUser(user: UserInterface) {
    return this.httpClient
      .post<UserInterface>(
        `${environment.baseUrl}/users/add`,
        user,
        httpOptions,
      )
      .pipe(
        tap((userReceived) => {
          const newUsers = [userReceived, ...this.usersSubject.value];
          return this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateUser(user: UserInterface, id: number) {
    return this.httpClient
      .put<UserInterface>(
        `${environment.baseUrl}/users/${id}`,
        user,
        httpOptions,
      )
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

  deleteUser(user: UserInterface) {
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

  getUserTypes() {
    return this.httpClient
      .get<
        UserTypeInterface[]
      >(`${environment.baseUrl}/user-types`, httpOptions)
      .pipe(
        tap((userTypes) => {
          return this.userTypesSubject.next(userTypes);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
