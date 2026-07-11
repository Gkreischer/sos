import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { MetricsService } from 'src/app/_services/metrics.service';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';
import { barChartOptions } from 'src/app/_charts/barChartOptions';
import { chartTypes } from 'src/app/_charts/chartTypes';
import { BaseChartDirective } from 'ng2-charts';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-bar-chart-counter',
  templateUrl: './bar-chart-counter.component.html',
  styleUrls: ['./bar-chart-counter.component.scss'],
  imports: [
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    BaseChartDirective,
  ],
})
export class BarChartCounterComponent implements OnInit {
  metricsService = inject(MetricsService);

  barChartOptions = barChartOptions;

  barChartType = chartTypes.bar;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Quantidade de OS' }],
  };

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate;
      const endDate = this.metricsService.endDate;

      if (startDate && endDate) {
        this.getOrdersByMonthMetrics();
      }
    });
  }

  ngOnInit() {
    this.getOrdersByMonthMetrics();
  }

  getOrdersByMonthMetrics() {
    const period = {
      startDate: this.metricsService.startDate,
      endDate: this.metricsService.endDate,
    };
    this.metricsService
      .getOrdersCountByMonthMetrics(period)
      .subscribe((data) => {
        this.barChartData = {
          labels: data.map((item) => item.month),
          datasets: [
            {
              data: data.map((item) => item.count),
              label: 'Quantidade de OS por mês e ano',
            },
          ],
        };
      });
  }
}
