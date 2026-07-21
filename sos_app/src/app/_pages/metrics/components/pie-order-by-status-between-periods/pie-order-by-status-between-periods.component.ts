import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartTypes } from 'src/app/_charts/chartTypes';
import { pieChartOptions } from 'src/app/_charts/pieChartOptions';
import { MetricsService } from 'src/app/_services/metrics.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-pie-order-by-status-between-periods',
  templateUrl: './pie-order-by-status-between-periods.component.html',
  styleUrls: ['./pie-order-by-status-between-periods.component.scss'],
  imports: [
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    BaseChartDirective,
  ],
})
export class PieOrderByStatusBetweenPeriodsComponent {
  metricsService = inject(MetricsService);

  public pieChartPlugins = [ChartDataLabels];

  public pieChartOptions = pieChartOptions;

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  public pieChartType = chartTypes.pie;

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate;
      const endDate = this.metricsService.endDate;

      if (startDate && endDate) {
        this.getData();
      }
    });
  }

  applyDataPieChart(labels: string[], data: number[]) {
    this.pieChartData.labels = labels;
    this.pieChartData.datasets[0].data = data;

    this.pieChartData = { ...this.pieChartData };
  }

  getData() {
    const period = {
      startDate: this.metricsService.startDate,
      endDate: this.metricsService.endDate,
    };
    this.metricsService.getOrderStatusMetrics(period).subscribe((data) => {
      this.applyDataPieChart(Object.keys(data), Object.values(data as any));
    });
  }
}
