import { Component, inject, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonSkeletonText,
  IonCardSubtitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-orders-peding-count-card',
  imports: [
    IonCardSubtitle,
    IonSkeletonText,
    IonText,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
  ],
  templateUrl: './orders-peding-count-card.component.html',
  styleUrl: './orders-peding-count-card.component.css',
})
export class OrdersPedingCountCardComponent implements OnInit {
  metricService = inject(MetricsService);

  count = this.metricService.ordersPendingCount;

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.metricService.getPendingOrdersCount().subscribe();
  }
}
