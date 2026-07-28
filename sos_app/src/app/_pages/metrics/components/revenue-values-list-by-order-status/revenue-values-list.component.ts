import { Component, effect, inject } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { MetricsService } from 'src/app/_services/metrics.service';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyPipe } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-revenue-values-list',
  templateUrl: './revenue-values-list.component.html',
  styleUrls: ['./revenue-values-list.component.scss'],
  imports: [
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    BaseChartDirective,
    CurrencyPipe,
  ],
})
export class RevenueValuesListComponent {
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

  primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-primary')
    .trim();

  secondaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-secondary')
    .trim();

  lightColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-light')
    .trim();

  successColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-success')
    .trim();

  dangerColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-danger')
    .trim();

  warningColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-warning')
    .trim();

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate;
      const endDate = this.metricsService.endDate;

      if (startDate && endDate) {
        this.getDataAndMakePolarAreaGraphic();
      }
    });
  }

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
              backgroundColor: [
                this.dangerColor,
                this.warningColor,
                this.successColor,
                this.primaryColor,
                this.lightColor,
              ],
            },
          ],
        };
      });
  }
}
