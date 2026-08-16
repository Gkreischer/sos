import {Component, effect, inject, OnInit, AfterViewInit, ChangeDetectionStrategy, viewChild} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class BarChartCounterComponent implements OnInit, AfterViewInit {
  metricsService = inject(MetricsService);
  chart = viewChild.required(BaseChartDirective);

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

  ngAfterViewInit() {
    // Force chart update after view init (needed for @defer + OnPush)
    this.updateChart();
  }

  getOrdersByMonthMetrics() {
    const period = {
      startDate: this.metricsService.startDate,
      endDate: this.metricsService.endDate,
    };
    this.metricsService
      .getOrdersCountByMonthMetrics(period)
      .subscribe((data) => {
        // Mutate data instead of replacing to work with OnPush + Chart.js
        this.barChartData.labels = data.map((item) => item.month);
        this.barChartData.datasets[0].data = data.map((item) => item.count);
        this.updateChart();
      });
  }

  private updateChart() {
    const chartDirective = this.chart();
    if (chartDirective?.chart) {
      chartDirective.chart.update();
    }
  }
}
