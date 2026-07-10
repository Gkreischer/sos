import { Component, effect, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import { IonicModule } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-technician-data-list',
  templateUrl: './technician-data-list.component.html',
  styleUrls: ['./technician-data-list.component.scss'],
  imports: [IonicModule, CurrencyPipe],
})
export class TechnicianDataListComponent {
  metricsService = inject(MetricsService);

  technicianOrderMetrics$ = this.metricsService.usersOrdersMetrics$;

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
      .subscribe();
  }
}
