import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { OrderInterface } from 'shared';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from 'shared';
import { OrderFilterInterface } from 'shared';
import { PaginateInterface } from 'shared';
import { inject } from '@angular/core';
import { PictureInterface } from 'shared';
import { ToastService } from 'shared';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);
  toastService = inject(ToastService);

  private ordersSubject: BehaviorSubject<OrderInterface[]> =
    new BehaviorSubject<OrderInterface[]>([]);
  private orderSubject: BehaviorSubject<OrderInterface> =
    new BehaviorSubject<OrderInterface>({} as OrderInterface);
  private clientOrdersHistorySubject: BehaviorSubject<OrderInterface[]> =
    new BehaviorSubject<OrderInterface[]>([]);

  public orderFilters = signal(null as OrderFilterInterface | null);

  constructor() {}

  get orders$() {
    return this.ordersSubject.asObservable();
  }

  get order$() {
    return this.orderSubject.asObservable();
  }

  get clientOrdersHistory$() {
    return this.clientOrdersHistorySubject.asObservable();
  }

  public setOrderFilter(orderFilter: OrderFilterInterface | null) {
    this.orderFilters.set(orderFilter);
  }

  public getAll(page?: number, orderFilter?: OrderFilterInterface | null) {
    return this.http
      .post<
        PaginateInterface<OrderInterface[]>
      >(`${environment.baseUrl}/orders/search${page ? `?page=${page}` : ''}`, orderFilter, httpOptions)
      .pipe(
        tap((res) => {
          if (page && page >= 2) {
            this.ordersSubject.next([
              ...this.ordersSubject.getValue(),
              ...res.data,
            ]);
          } else {
            this.ordersSubject.next(res.data);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }

  getById(id: number) {
    return this.http
      .get<OrderInterface>(`${environment.baseUrl}/orders/${id}`, httpOptions)
      .pipe(
        tap((res) => {
          return this.orderSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  update(id: number, order: OrderInterface) {
    return this.http
      .put<OrderInterface>(
        `${environment.baseUrl}/orders/${id}`,
        order,
        httpOptions,
      )
      .pipe(
        tap((res) => {
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

  create(order: OrderInterface, pictures: PictureInterface[]) {
    const formData = new FormData();

    Object.entries(order).forEach(([key, value]) => {
      if (key === 'parts' || key === 'pictures') {
        return;
      }

      formData.append(key, String(value ?? ''));
    });

    order.parts.forEach((part, index) => {
      formData.append(`parts[${index}][id]`, String(part.id));
      formData.append(`parts[${index}][quantity]`, String(part.quantity));
      formData.append(`parts[${index}][price]`, String(part.price));
    });

    pictures.forEach((picture, index) => {
      formData.append(
        'pictures[]',
        picture.blob,
        `picture-${index}.${picture.format ?? 'jpg'}`,
      );
    });

    return this.http
      .post<OrderInterface>(`${environment.baseUrl}/orders`, formData)
      .pipe(
        tap((res) => {
          const orders = this.ordersSubject.getValue();

          this.ordersSubject.next([res, ...orders]);
          this.orderSubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getClientOrdersHistory(clientId: number) {
    return this.http
      .get<
        OrderInterface[]
      >(`${environment.baseUrl}/users/${clientId}/orders`, httpOptions)
      .pipe(
        tap((res) => {
          this.clientOrdersHistorySubject.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
