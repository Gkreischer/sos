import { Component, inject, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import {
  IonSkeletonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-orders-inprogress-count-card',
  imports: [
    IonText,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonSkeletonText,
  ],
  templateUrl: './orders-inprogress-count-card.component.html',
  styleUrl: './orders-inprogress-count-card.component.css',
})
export class OrdersInprogressCountCardComponent implements OnInit {
  metricService = inject(MetricsService);

  count = this.metricService.ordersInProgressCount;

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.metricService.getInProgressOrdersCount().subscribe();
  }
}
