import { Component, inject, effect, signal, OnDestroy } from '@angular/core';
import { MetricsService } from 'src/app/_services/metrics.service';
import { Subscription } from 'rxjs';
import {
  IonItem,
  IonList,
  IonCardContent,
  IonCard,
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonButton,
  IonToolbar,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  people,
  hardwareChip,
  calendar,
  card,
  cloudDownload,
  bagHandle,
} from 'ionicons/icons';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { OrderInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { OrderModalComponent } from 'src/app/_pages/orders/components/order-modal/order-modal.component';
import { SpreadSheetService } from 'src/app/_services/spreadsheet.service';

@Component({
  selector: 'app-orders-by-period',
  imports: [
    IonCardTitle,
    IonCardHeader,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonChip,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    DatePipe,
    CurrencyPipe,
    IonButton,
    IonText,
  ],
  templateUrl: './orders-by-period.component.html',
  styleUrl: './orders-by-period.component.scss',
})
export class OrdersByPeriodComponent {
  metricsService = inject(MetricsService);
  modalService = inject(ModalService);
  spreadSheetService = inject(SpreadSheetService);
  ordersByPeriod$ = this.metricsService.ordersByPeriod;

  subscription?: Subscription;
  infiniteScroll = signal(true);
  page: number = 1;

  constructor() {
    addIcons({
      people,
      hardwareChip,
      calendar,
      card,
      cloudDownload,
      bagHandle,
    });
    effect((onCleanup) => {
      const startDate = this.metricsService.startDate;
      const endDate = this.metricsService.endDate;

      this.page = 1;
      this.infiniteScroll.set(true);

      if (startDate && endDate) {
        this.getOrdersByPeriod();
      }

      onCleanup(() => {
        this.subscription?.unsubscribe();
      });
    });
  }

  getOrdersByPeriod() {
    this.subscription = this.metricsService
      .getOrdersByPeriod({
        startDate: this.metricsService.startDate,
        endDate: this.metricsService.endDate,
      })
      .subscribe();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.page++;
    this.subscription = this.metricsService
      .getOrdersByPeriod(
        {
          startDate: this.metricsService.startDate,
          endDate: this.metricsService.endDate,
        },
        this.page,
      )
      .subscribe((res) => {
        event.target.complete();
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
  }

  openOrderModal(order: OrderInterface) {
    this.modalService.openModal(
      OrderModalComponent,
      { orderId: order.id },
      'full-modal',
    );
  }

  generateOrderByPeriodMetricCSV() {
    this.spreadSheetService.generateOrdersByPeriodMetricCSV();
  }

  generateOrderByPeriodMetricXLSX() {
    this.spreadSheetService.generateOrdersByPeriodMetricXLSX();
  }
}
