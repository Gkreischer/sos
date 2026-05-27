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
      const message = err?.error?.message || err?.message || 'Erro interno';

      switch (err.status) {
        case 401:
          loginService.logout();
          break;
        case 0:
          toastService.presentToast('Erro crítico', 'bottom', 2000, 'danger');
          break;
      }

      toastService.presentToast(
        `${err.status} - ${message}`,
        'bottom',
        2000,
        'danger',
      );

      return throwError(() => err);
    }),
  );
};
