import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../_models/Order';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  private orderSubject: BehaviorSubject<Order> = new BehaviorSubject<Order>({} as Order);

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  get orders$() {
    return this.ordersSubject.asObservable();
  }

  get order$() {
    return this.orderSubject.asObservable();
  }

  getOrdersStatusOpened() {
    return this.http.get<Order[]>(`${environment.baseUrl}/orders/opened`, httpOptions).pipe(
      tap(
        (res) => {
          return this.ordersSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }

  getOrdersStatusInProgress() {
    return this.http.get<Order[]>(`${environment.baseUrl}/orders/in-progress`, httpOptions).pipe(
      tap(
        (res) => {
          return this.ordersSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }

  getOrdersStatusFinished() {
    return this.http.get<Order[]>(`${environment.baseUrl}/orders/finished`, httpOptions).pipe(
      tap(
        (res) => {
          return this.ordersSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }

  getById(id: number) {
    return this.http.get<Order>(`${environment.baseUrl}/orders/${id}`, httpOptions).pipe(
      tap(
        (res) => {
          return this.orderSubject.next(res);
        }
      ),
      catchError(this.errorService.handleError)
    );
  }
}
