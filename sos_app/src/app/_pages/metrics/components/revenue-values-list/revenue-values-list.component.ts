import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { OrderTotalPriceByStatusInterface } from 'src/app/_interfaces/OrderTotalPriceByStatusInterface';
import { MetricsService } from 'src/app/_services/metrics.service';

@Component({
  selector: 'app-revenue-values-list',
  templateUrl: './revenue-values-list.component.html',
  styleUrls: ['./revenue-values-list.component.scss'],
  standalone: false,
})
export class RevenueValuesListComponent implements OnInit {
  metricsService = inject(MetricsService);

  totalPriceByStatus$ = this.metricsService.orderTotalPriceByStatus;

  polarAreaChartLabels: string[] = [];

  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'R$',
      },
    ],
  };
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate;
      const endDate = this.metricsService.endDate;

      if (startDate && endDate) {
        this.getDataAndMakePolarAreaGraphic();
      }
    });
  }

  ngOnInit() {}

  getDataAndMakePolarAreaGraphic() {
    this.metricsService
      .getOrdersTotalPriceByStatus({
        startDate: this.metricsService.startDate,
        endDate: this.metricsService.endDate,
      })
      .subscribe((res) => {
        this.polarAreaChartData = {
          labels: res.map((item) => item.name),
          datasets: [
            {
              data: res.map((item) => item.revenue),
              label: 'R$',
            },
          ],
        };
      });
  }
}
