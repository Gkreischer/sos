import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../_models/Order';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';
import { OrderFilter } from '../_models/OrderFilter';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<
    Order[]
  >([]);
  private orderSubject: BehaviorSubject<Order> = new BehaviorSubject<Order>(
    {} as Order,
  );

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
  ) {}

  get orders$() {
    return this.ordersSubject.asObservable();
  }

  get order$() {
    return this.orderSubject.asObservable();
  }

  getAll() {
    return this.http
      .get<Order[]>(`${environment.baseUrl}/orders`, httpOptions)
      .pipe(
        tap((res) => this.ordersSubject.next(res)),
        catchError(this.errorService.handleError),
      );
  }

  getOrderByFilter(orderFilter: OrderFilter) {
    return this.http
      .post<Order[]>(`${environment.baseUrl}/orders/search`, orderFilter)
      .pipe(
        tap((res) => {
          return this.ordersSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getById(id: number) {
    return this.http
      .get<Order>(`${environment.baseUrl}/orders/${id}`, httpOptions)
      .pipe(
        tap((res) => {
          return this.orderSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  update(id: number, order: Order) {
    return this.http
      .put<Order>(`${environment.baseUrl}/orders/${id}`, order, httpOptions)
      .pipe(
        tap((res) => {
          console.log('recebendo res', res);
          const orders = this.ordersSubject.getValue();

          const updatedOrders = orders.map((order) => {
            if (order.id === id) {
              return res;
            }

            return order;
          });

          this.ordersSubject.next(updatedOrders);
          this.orderSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  create(order: Order) {
    return this.http
      .post<Order>(`${environment.baseUrl}/orders`, order, httpOptions)
      .pipe(
        tap((res) => {
          console.log('recebendo res', res);
          const orders = this.ordersSubject.getValue();
          orders.push(res);
          this.ordersSubject.next(orders);
          this.orderSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
