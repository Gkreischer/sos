import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import {
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonLabel,
  IonIcon,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { hourglass } from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-orders-inprogress-count-card',
  imports: [
    IonItem,
    IonList,
    IonIcon,
    IonLabel,
    IonCardContent,
    IonCard,
    IonSkeletonText,
  ],
  templateUrl: './orders-inprogress-count-card.component.html',
  styleUrl: './orders-inprogress-count-card.component.scss',
})
export class OrdersInprogressCountCardComponent implements OnInit {
  metricService = inject(MetricsService);

  count = this.metricService.ordersInProgressCount;

  constructor() {
    addIcons({ hourglass });
  }

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.metricService.getInProgressOrdersCount().subscribe();
  }
}
