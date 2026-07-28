import { Component, inject, effect, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonNote,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-customer-revenue-list',
  imports: [
    IonNote,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    CurrencyPipe,
  ],
  templateUrl: './customer-revenue-list.component.html',
  styleUrl: './customer-revenue-list.component.scss',
})
export class CustomerRevenueListComponent {
  metricsService = inject(MetricsService);

  customerRevenueList$ = this.metricsService.customerRevenueList;

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate$();
      const endDate = this.metricsService.endDate$();

      if (startDate && endDate) {
        this.getCustomerRevenueList();
      }
    });
  }

  getCustomerRevenueList() {
    this.metricsService
      .getCustomerRevenueList({
        startDate: this.metricsService.startDate$(),
        endDate: this.metricsService.endDate$(),
      })
      .subscribe();
  }
}
