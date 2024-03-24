import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ToastService } from '../_services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastService: ToastService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return next.handle(request).pipe(
      retry(2), // retry a failed request up to 2 times
        catchError((err: HttpErrorResponse) => {
            this.toastService.presentToast(err.message, 'bottom', 2000, 'danger');
            if (err.status === 0) {
                //client-side or network error
                console.log('An error occurred:', err.error.message);
                // return of()
            } else {
                //Backend returns error codes such as 404, 500 etc.			 
                console.log('Error code: ', err.status);
            }
            
            return throwError(() => new Error('An error occurred. Please try again later.'));
        })
    );
  }
}
