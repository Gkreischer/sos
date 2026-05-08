import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { OrderStatus } from '../_models/OrderStatus';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  orderStatusSubject: BehaviorSubject<OrderStatus[]> = new BehaviorSubject<
    OrderStatus[]
  >([]);

  constructor() {}

  get order_statuses() {
    return this.orderStatusSubject.asObservable();
  }

  getOrderStatuses() {
    return this.http
      .get<OrderStatus[]>(`${environment.baseUrl}/order-status`)
      .pipe(
        tap((data) => {
          this.orderStatusSubject.next(data);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
