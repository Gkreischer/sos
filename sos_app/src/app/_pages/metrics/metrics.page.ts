import { Component, inject, OnInit } from '@angular/core';
import {} from 'src/app/_masks/dateMask';

import { IonicModule } from '@ionic/angular';
import { MetricFilterComponent } from './components/metric-filter/metric-filter.component';
import { BarChartCounterComponent } from './components/bar-chart-order-monthly-year-quantity/bar-chart-counter.component';
import { PieOrderByStatusBetweenPeriodsComponent } from './components/pie-order-by-status-between-periods/pie-order-by-status-between-periods.component';
import { LineChartTotalPriceBetweenPeriodsComponent } from './components/line-chart-total-price-between-periods/line-chart-total-price-between-periods.component';
import { RevenueValuesListComponent } from './components/revenue-values-list/revenue-values-list.component';
import { TechnicianDataListComponent } from './components/technician-data-list/technician-data-list.component';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
  imports: [
    IonicModule,
    MetricFilterComponent,
    BarChartCounterComponent,
    PieOrderByStatusBetweenPeriodsComponent,
    LineChartTotalPriceBetweenPeriodsComponent,
    RevenueValuesListComponent,
    TechnicianDataListComponent,
  ],
})
export class MetricsPage implements OnInit {
  ngOnInit(): void {}
}
