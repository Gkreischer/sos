import { Component, inject, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import {
  IonCardTitle,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSkeletonText,
  IonText,
  IonCardSubtitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-total-clients-count-card',
  imports: [
    IonCardSubtitle,
    IonText,
    IonSkeletonText,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonCardTitle,
  ],
  templateUrl: './total-clients-count-card.component.html',
  styleUrl: './total-clients-count-card.component.css',
})
export class TotalClientsCountCardComponent implements OnInit {
  metricService = inject(MetricsService);

  count = this.metricService.totalClientsCount;

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.metricService.getTotalClientsCount().subscribe();
  }
}
