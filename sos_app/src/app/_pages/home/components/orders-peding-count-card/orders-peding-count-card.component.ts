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
  IonLabel,
  IonIcon,
  IonItem,
  IonList,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flame } from 'ionicons/icons';
@Component({
  selector: 'app-orders-peding-count-card',
  imports: [
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonSkeletonText,
    IonCardContent,
    IonCard,
  ],
  templateUrl: './orders-peding-count-card.component.html',
  styleUrl: './orders-peding-count-card.component.css',
})
export class OrdersPedingCountCardComponent implements OnInit {
  metricService = inject(MetricsService);

  count = this.metricService.ordersPendingCount;

  constructor() {
    addIcons({ flame });
  }

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.metricService.getPendingOrdersCount().subscribe();
  }
}
