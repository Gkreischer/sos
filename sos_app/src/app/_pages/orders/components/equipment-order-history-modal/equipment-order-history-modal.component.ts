import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonContent,
  IonItem,
  IonCard,
  IonCardContent,
  IonList,
  IonLabel,
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { EquipmentInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OrderInterface } from 'shared';
import { addIcons } from 'ionicons';
import {
  hardwareChip,
  person,
  calendar,
  card,
  arrowBack,
} from 'ionicons/icons';
import { CurrencyPipe } from '@angular/common';
import { OrderModalComponent } from 'src/app/_pages/orders/components/order-modal/order-modal.component';
import { LoadingService } from 'shared';
@Component({
  selector: 'app-equipment-order-history-modal',
  imports: [
    IonSpinner,
    IonChip,
    IonLabel,
    IonList,
    IonCardContent,
    IonCard,
    IonItem,
    IonContent,
    IonRow,
    IonGrid,
    IonCol,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './equipment-order-history-modal.component.html',
  styleUrl: './equipment-order-history-modal.component.scss',
})
export class EquipmentOrderHistoryModalComponent implements OnInit {
  modalService = inject(ModalService);
  equipmentService = inject(EquipmentService);
  loadingService = inject(LoadingService);
  orderHistories$: Observable<OrderInterface[] | null> =
    this.equipmentService.equipmentOrderHistory$;
  isLoading$ = this.loadingService.isLoading$;
  equipmentId!: number;

  constructor() {
    addIcons({ hardwareChip, person, calendar, card, arrowBack });
  }

  ngOnInit() {
    this.getHistory();
  }

  getHistory() {
    this.equipmentService.getOrderHistory(this.equipmentId!).subscribe();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  openOrderModal(order: OrderInterface) {
    this.modalService.openModal(
      OrderModalComponent,
      { orderId: order.id },
      'full-modal',
    );
  }
}
