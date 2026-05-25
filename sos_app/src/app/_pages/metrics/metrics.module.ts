import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetricsPageRoutingModule } from './metrics-routing.module';

import { MetricsPage } from './metrics.page';
import { MaskitoDirective } from '@maskito/angular';
import { BarChartCounterComponent } from './components/bar-chart-order-monthly-year-quantity/bar-chart-counter.component';
import { LineChartTotalPriceBetweenPeriodsComponent } from './components/line-chart-total-price-between-periods/line-chart-total-price-between-periods.component';
import { PieOrderByStatusBetweenPeriodsComponent } from './components/pie-order-by-status-between-periods/pie-order-by-status-between-periods.component';
import { BaseChartDirective } from 'ng2-charts';
import { MetricFilterComponent } from './components/metric-filter/metric-filter.component';
import { RevenueValuesListComponent } from './components/revenue-values-list/revenue-values-list.component';
import { TechnicianDataListComponent } from './components/technician-data-list/technician-data-list.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MetricsPageRoutingModule,
    MaskitoDirective,
    BaseChartDirective,
  ],
  declarations: [
    MetricsPage,
    BarChartCounterComponent,
    LineChartTotalPriceBetweenPeriodsComponent,
    PieOrderByStatusBetweenPeriodsComponent,
    MetricFilterComponent,
    RevenueValuesListComponent,
    TechnicianDataListComponent,
  ],
})
export class MetricsPageModule {}
