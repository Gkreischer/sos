import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { chartTypes } from 'src/app/_charts/chartTypes';
import { lineChartOptions } from 'src/app/_charts/lineChartOptions';
import { MetricsService } from 'src/app/_services/metrics.service';

@Component({
  selector: 'app-line-chart-total-price-between-periods',
  templateUrl: './line-chart-total-price-between-periods.component.html',
  styleUrls: ['./line-chart-total-price-between-periods.component.scss'],
  standalone: false,
})
export class LineChartTotalPriceBetweenPeriodsComponent implements OnInit {
  private metricsService = inject(MetricsService);

  lineChartType = chartTypes.line;
  lineChartOptions = lineChartOptions;
  lineChartData: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Movimentação financeira',
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

  ngOnInit() {}

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
            label: 'Movimentação financeira',
            data: data.map((item) => item.total_price),
          },
        ],
      };
    });
  }
}
