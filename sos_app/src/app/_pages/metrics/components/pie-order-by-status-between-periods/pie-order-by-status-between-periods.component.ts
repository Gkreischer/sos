import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartTypes } from 'src/app/_charts/chartTypes';
import { pieChartOptions } from 'src/app/_charts/pieChartOptions';
import { MetricsService } from 'src/app/_services/metrics.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-pie-order-by-status-between-periods',
    templateUrl: './pie-order-by-status-between-periods.component.html',
    styleUrls: ['./pie-order-by-status-between-periods.component.scss'],
    imports: [IonicModule, BaseChartDirective],
})
export class PieOrderByStatusBetweenPeriodsComponent implements OnInit {
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

  ngOnInit() {}

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
      console.log(data);
      this.applyDataPieChart(Object.keys(data), Object.values(data as any));
    });
  }
}
