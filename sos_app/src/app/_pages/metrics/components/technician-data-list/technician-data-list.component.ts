import { Component, effect, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import { CurrencyPipe } from '@angular/common';
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

@Component({
  selector: 'app-technician-data-list',
  templateUrl: './technician-data-list.component.html',
  styleUrls: ['./technician-data-list.component.scss'],
  standalone: true,
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
})
export class TechnicianDataListComponent {
  metricsService = inject(MetricsService);

  technicianOrderMetrics$ = this.metricsService.techiniciansOrdersMetrics$;

  constructor() {
    effect(() => {
      const startDate = this.metricsService.startDate$();
      const endDate = this.metricsService.endDate$();

      if (startDate && endDate) {
        this.getTechnicianOrderMetrics();
      }
    });
  }

  getTechnicianOrderMetrics() {
    this.metricsService
      .getTechnicianOrderMetrics({
        startDate: this.metricsService.startDate$(),
        endDate: this.metricsService.endDate$(),
      })
      .subscribe((res) => console.log(res));
  }
}
