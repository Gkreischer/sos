import { Component, effect, inject } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartTypes } from 'src/app/_charts/chartTypes';
import { lineChartOptions } from 'src/app/_charts/lineChartOptions';
import { MetricsService } from 'src/app/_services/metrics.service';

import { BaseChartDirective } from 'ng2-charts';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-line-chart-total-price-between-periods',
  templateUrl: './line-chart-total-price-between-periods.component.html',
  styleUrls: ['./line-chart-total-price-between-periods.component.scss'],
  imports: [
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    BaseChartDirective,
  ],
})
export class LineChartTotalPriceBetweenPeriodsComponent {
  private metricsService = inject(MetricsService);

  lineChartType = chartTypes.line;
  lineChartOptions = lineChartOptions;
  lineChartData: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Valor total das OS Entregues',
      },
    ],
  };

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate;
      const endDate = this.metricsService.endDate;

      if (startDate && endDate) {
        this.getTotalPriceOrderByPeriod();
      }
    });
  }

  getTotalPriceOrderByPeriod() {
    const period = {
      startDate: this.metricsService.startDate,
      endDate: this.metricsService.endDate,
    };
    this.metricsService.getTotalPriceOrderByPeriod(period).subscribe((data) => {
      this.lineChartData = {
        labels: data.map((item) => item.month),
        datasets: [
          {
            label: 'Valor total das OS Entregues R$',
            data: data.map((item) => item.total_price),
          },
        ],
      };
    });
  }
}
