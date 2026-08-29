import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, retry, throwError } from 'rxjs';

import { ToastService } from '../_services/toast.service';
import { LoginService } from '../_services/login.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const loginService = inject(LoginService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = getErrorMessage(err.error);

      switch (err.status) {
        case 401:
          loginService.logout();
          toastService.presentToast(
            `${err.status} - ${message}`,
            'bottom',
            4000,
            'danger',
          );
          return throwError(() => err);
      }

      toastService.presentToast(
        `${err.status} - ${message}`,
        'bottom',
        4000,
        'danger',
      );

      return throwError(() => err);
    }),
  );
};

function getErrorMessage(error: any): string {
  if (!error) {
    return 'Erro interno.';
  }

  if (typeof error.message === 'string') {
    return error.message;
  }

  if (typeof error === 'object') {
    const messages = Object.values(error).reduce<string[]>((acc, value) => {
      if (Array.isArray(value)) {
        return [...acc, ...value];
      }

      if (typeof value === 'string') {
        return [...acc, value];
      }

      return acc;
    }, []);

    if (messages.length) {
      return messages.join('\n');
    }
  }

  return 'Erro interno.';
}
