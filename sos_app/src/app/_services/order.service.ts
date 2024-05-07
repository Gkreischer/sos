import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../_models/Order';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  get orders$() {
    return this.ordersSubject.asObservable();
  }

  getOrdersStatusOpened() {
    return this.http.get<Order[]>(`${environment.baseUrl}/orders/opened`).pipe(
      tap(
        (res) => {
          return this.ordersSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }

  getOrdersStatusInProgress() {
    return this.http.get<Order[]>(`${environment.baseUrl}/orders/in-progress`).pipe(
      tap(
        (res) => {
          return this.ordersSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }

  getOrdersStatusFinished() {
    return this.http.get<Order[]>(`${environment.baseUrl}/orders/finished`).pipe(
      tap(
        (res) => {
          return this.ordersSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }
}
