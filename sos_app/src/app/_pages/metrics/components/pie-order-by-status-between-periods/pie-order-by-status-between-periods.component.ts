import {Component, effect, inject, OnInit, AfterViewInit, ChangeDetectionStrategy, viewChild} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class PieOrderByStatusBetweenPeriodsComponent implements OnInit, AfterViewInit {
  metricsService = inject(MetricsService);
  chart = viewChild.required(BaseChartDirective);

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

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    // Force chart update after view init (needed for @defer + OnPush)
    this.updateChart();
  }

  applyDataPieChart(labels: string[], data: number[]) {
    this.pieChartData.labels = labels;
    this.pieChartData.datasets[0].data = data;

    this.pieChartData = { ...this.pieChartData };
    this.updateChart();
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

  private updateChart() {
    const chartDirective = this.chart();
    if (chartDirective?.chart) {
      chartDirective.chart.update();
    }
  }
}
