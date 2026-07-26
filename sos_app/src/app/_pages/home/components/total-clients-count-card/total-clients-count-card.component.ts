import { Component, inject, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import {
  IonCard,
  IonCardContent,
  IonSkeletonText,
  IonText,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleSharp } from 'ionicons/icons';
@Component({
  selector: 'app-total-clients-count-card',
  imports: [
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonText,
    IonSkeletonText,
    IonCardContent,
    IonCard,
  ],
  templateUrl: './total-clients-count-card.component.html',
  styleUrl: './total-clients-count-card.component.css',
})
export class TotalClientsCountCardComponent implements OnInit {
  metricService = inject(MetricsService);

  count = this.metricService.totalClientsCount;

  constructor() {
    addIcons({
      peopleSharp,
    });
  }

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.metricService.getTotalClientsCount().subscribe();
  }
}
