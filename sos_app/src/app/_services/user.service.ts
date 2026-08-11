import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { UserInterface } from 'shared';
import { catchError, tap, BehaviorSubject } from 'rxjs';
import { ErrorService } from 'shared';
import { environment } from 'src/environments/environment';
import { PaginateInterface } from 'shared';
import { UserTypeInterface } from 'shared';
import { LoginService } from 'shared';
import { UserFilterInterface } from 'shared';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  errorService: ErrorService = inject(ErrorService);
  loginService: LoginService = inject(LoginService);

  usersSubject = new BehaviorSubject<UserInterface[] | null>(null);
  userTypesSubject = new BehaviorSubject<UserTypeInterface[]>([]);

  userFilter = signal<UserFilterInterface | null>(null);

  constructor() {}

  get users() {
    return this.usersSubject.asObservable();
  }

  get userTypes() {
    return this.userTypesSubject.asObservable();
  }

  setUserFilter(userFilter: UserFilterInterface) {
    this.userFilter.set(userFilter);
  }

  getUsers(page?: number, filters?: UserFilterInterface | null) {
    return this.http
      .post<
        PaginateInterface<UserInterface[]>
      >(`${environment.baseUrl}/users${page ? `?page=${page}` : ''}`, this.userFilter(), httpOptions)
      .pipe(
        tap((res) => {
          if (page && page >= 2) {
            this.usersSubject.next([
              ...(this.usersSubject.getValue() ?? []),
              ...res.data,
            ]);
          } else {
            this.usersSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }

  getUserByDesc(filter: UserFilterInterface) {
    return this.http
      .post<
        PaginateInterface<UserInterface[]>
      >(`${environment.baseUrl}/users`, filter, httpOptions)
      .pipe(
        tap((res) => {
          return this.usersSubject.next(res.data);
        }),
        catchError(this.errorService.handleError),
      );
  }

  addUser(user: UserInterface) {
    return this.http
      .post<UserInterface>(
        `${environment.baseUrl}/users/add`,
        user,
        httpOptions,
      )
      .pipe(
        tap((userReceived) => {
          const newUsers = [userReceived, ...(this.usersSubject.value ?? [])];
          return this.usersSubject.next(newUsers);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateUser(user: UserInterface, id: number) {
    return this.http
      .put<UserInterface>(
        `${environment.baseUrl}/users/${id}`,
        user,
        httpOptions,
      )
      .pipe(
        tap((userReceived) => {
          const newUsers = this.usersSubject.value?.map((user) => {
            if (user.id === userReceived.id) {
              return userReceived;
            }

            return user;
          });
          if (this.loginService.userSubject.value?.id === userReceived.id) {
            this.loginService.userSubject.next(userReceived);
          }

          return this.usersSubject.next(newUsers ?? []);
        }),
        catchError(this.errorService.handleError),
      );
  }

  deleteUser(user: UserInterface) {
    return this.http
      .delete(`${environment.baseUrl}/users/${user.id}`, httpOptions)
      .pipe(
        tap((res) => {
          const newUsers = this.usersSubject.value?.filter(
            (userListItem) => userListItem.id !== user.id,
          );
          this.usersSubject.next(newUsers ?? []);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getUserTypes() {
    return this.http
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

  updateAvatarImage(imagePath: string) {
    return this.http
      .post<UserInterface>(`${environment.baseUrl}/user/image/change`, {
        imagePath: imagePath,
      })
      .pipe(
        tap((user) => {
          this.loginService.userSubject.next(user);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
