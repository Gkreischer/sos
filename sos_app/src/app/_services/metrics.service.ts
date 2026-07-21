import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderMonthMetricInterface } from 'shared';
import { catchError, tap } from 'rxjs';
import { ErrorService } from 'shared';
import { CountInterface } from 'shared';
import { OrderMonthIncomesInterface } from 'shared';
import { OrderTotalPriceByStatusInterface } from 'shared';
import { TechnicianMetricsInterface } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  orderCountByMonthMetric = signal([] as OrderMonthMetricInterface[]);
  orderStatusMetrics = signal<Record<string, number>>({});
  orderTotalPriceByMonthMetric = signal([] as OrderMonthIncomesInterface[]);
  orderTotalPriceByStatus = signal([] as OrderTotalPriceByStatusInterface[]);
  ordersPendingCount = signal<number | null>(null);
  ordersInProgressCount = signal<number | null>(null);
  totalClientsCount = signal<number | null>(null);
  usersOrdersMetrics$ = signal([] as TechnicianMetricsInterface[]);

  startDate$ = signal<string>(
    `01/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`,
  );
  endDate$ = signal<string>(new Date().toLocaleDateString('pt-BR'));

  http = inject(HttpClient);
  errorService = inject(ErrorService);

  constructor() {}

  get startDate() {
    return this.startDate$();
  }

  get endDate() {
    return this.endDate$();
  }

  getOrderStatusMetrics(period: { startDate: string; endDate: string }) {
    return this.http
      .post<
        Record<string, number>
      >(`${environment.baseUrl}/metrics/orders/status`, period)
      .pipe(
        tap((res) => {
          this.orderStatusMetrics.set(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getOrdersCountByMonthMetrics(period: { startDate: string; endDate: string }) {
    return this.http
      .post<
        OrderMonthMetricInterface[]
      >(`${environment.baseUrl}/metrics/orders/year`, period)
      .pipe(
        tap((res) => {
          this.orderCountByMonthMetric.set(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getTotalPriceOrderByPeriod(period: { startDate: string; endDate: string }) {
    return this.http
      .post<
        OrderMonthIncomesInterface[]
      >(`${environment.baseUrl}/metrics/orders/total-price`, period)
      .pipe(
        tap((res) => {
          this.orderTotalPriceByMonthMetric.set(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getOrdersTotalPriceByStatus(period: { startDate: string; endDate: string }) {
    return this.http
      .post<
        OrderTotalPriceByStatusInterface[]
      >(`${environment.baseUrl}/metrics/orders/revenue`, period)
      .pipe(
        tap((res) => {
          this.orderTotalPriceByStatus.set(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getTechnicianOrderMetrics(period: { startDate: string; endDate: string }) {
    return this.http
      .post<
        TechnicianMetricsInterface[]
      >(`${environment.baseUrl}/metrics/technicians`, period)
      .pipe(
        tap((res) => {
          this.usersOrdersMetrics$.set(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getPendingOrdersCount() {
    return this.http
      .get<CountInterface>(
        `${environment.baseUrl}/metrics/pending-orders/count`,
      )
      .pipe(
        tap((res) => {
          this.ordersPendingCount.set(res.result);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getInProgressOrdersCount() {
    return this.http
      .get<CountInterface>(`${environment.baseUrl}/metrics/in-progress/count`)
      .pipe(
        tap((res) => {
          this.ordersInProgressCount.set(res.result);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getTotalClientsCount() {
    return this.http
      .get<CountInterface>(`${environment.baseUrl}/metrics/clients/count`)
      .pipe(
        tap((res) => {
          this.totalClientsCount.set(res.result);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
