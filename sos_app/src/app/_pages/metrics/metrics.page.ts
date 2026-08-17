import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { MetricFilterComponent } from './components/metric-filter/metric-filter.component';
import { BarChartCounterComponent } from './components/bar-chart-order-monthly-year-quantity/bar-chart-counter.component';
import { PieOrderByStatusBetweenPeriodsComponent } from './components/pie-order-by-status-between-periods/pie-order-by-status-between-periods.component';
import { LineChartTotalPriceBetweenPeriodsComponent } from './components/line-chart-total-price-between-periods/line-chart-total-price-between-periods.component';
import { RevenueValuesListComponent } from './components/revenue-values-list-by-order-status/revenue-values-list.component';
import { TechnicianDataListComponent } from './components/technician-data-list/technician-data-list.component';
import { CustomerRevenueListComponent } from './components/customer-revenue-list/customer-revenue-list.component';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonCardHeader,
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonMenuButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { OrdersByPeriodComponent } from './components/orders-by-period/orders-by-period.component';
import { ViewDidLeave } from '@ionic/angular';
import { MetricsService } from 'src/app/_services/metrics.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonSpinner,
    MetricFilterComponent,
    BarChartCounterComponent,
    PieOrderByStatusBetweenPeriodsComponent,
    LineChartTotalPriceBetweenPeriodsComponent,
    RevenueValuesListComponent,
    TechnicianDataListComponent,
    CustomerRevenueListComponent,
    OrdersByPeriodComponent,
    IonMenuButton,
  ],
})
export class MetricsPage implements ViewDidLeave {
  metricsService = inject(MetricsService);

  ionViewDidLeave() {
    this.metricsService.startDate$.set(
      `01/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`,
    );
    this.metricsService.endDate$.set(new Date().toLocaleDateString('pt-BR'));
  }
}
