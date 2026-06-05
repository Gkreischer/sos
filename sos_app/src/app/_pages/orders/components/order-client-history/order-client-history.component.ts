import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonCardHeader,
  IonChip,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonCard,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { ModalService } from 'src/app/_services/modal.service';
import { inject } from '@angular/core';
import { OrderService } from 'src/app/_services/order.service';
import { Observable } from 'rxjs';
import { OrderInterface } from 'src/app/_interfaces/OrderInterface';
import { DatePipe, AsyncPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
import { OrderModalComponent } from '../order-modal/order-modal.component';
@Component({
  selector: 'app-order-client-history',
  templateUrl: './order-client-history.component.html',
  styleUrls: ['./order-client-history.component.scss'],
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCard,
    IonSpinner,
    IonLabel,
    IonItem,
    IonList,
    IonChip,
    IonCardHeader,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    DatePipe,
    AsyncPipe,
  ],
})
export class OrderClientHistoryComponent implements OnInit {
  modalService = inject(ModalService);
  orderService = inject(OrderService);
  loadingService = inject(LoadingService);

  clientId!: number;
  clientOrdersHistory$: Observable<OrderInterface[]> =
    this.orderService.clientOrdersHistory$;

  isLoading$ = this.loadingService.isLoading$;
  constructor() {}

  ngOnInit() {
    this.getClientOrdersHistory();
  }

  close() {
    this.modalService.closeModal();
  }

  getClientOrdersHistory() {
    this.orderService.getClientOrdersHistory(this.clientId).subscribe();
  }

  openModalOrder(orderId: number) {
    this.modalService.openModal(
      OrderModalComponent,
      { orderId: orderId },
      'full-modal',
    );
  }
}
