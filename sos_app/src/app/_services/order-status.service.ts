import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { OrderStatusInterface } from 'shared';
import { ErrorService } from 'shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  protected orderStatusSubject = new BehaviorSubject<OrderStatusInterface[]>(
    [],
  );

  constructor() {}

  get order_statuses() {
    return this.orderStatusSubject.asObservable();
  }

  getOrderStatuses() {
    return this.http
      .get<OrderStatusInterface[]>(`${environment.baseUrl}/order-status`)
      .pipe(
        tap((data) => {
          this.orderStatusSubject.next(data);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
