import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ToastService } from '../_services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(2), // retry a failed request up to 2 times
      catchError((err: HttpErrorResponse) => {
        const message = err?.error?.message || err?.message || 'Erro interno';

        this.toastService.presentToast(message, 'bottom', 2000, 'danger');

        if (err.status === 0) {
          console.error('An error occurred:', message);
        } else {
          console.error('Error code:', err.status, 'Error message:', message);
        }

        return throwError(() => err);
      }),
    );
  }
}
