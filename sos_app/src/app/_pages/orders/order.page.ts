import { Component, inject, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { OrderModalComponent } from './components/order-modal/order-modal.component';

import { OrderFilterComponent } from './components/order-filter/order-filter.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderService } from 'src/app/_services/order.service';
import { TourAnchorIonPopoverDirective } from 'ngx-ui-tour-ionic';
import { CodeReaderService } from 'src/app/_services/code-reader.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonMenuButton,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { addSharp, qrCode } from 'ionicons/icons';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  imports: [
    IonIcon,
    IonFabButton,
    IonContent,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonMenuButton,
    OrderFilterComponent,
    OrdersListComponent,
    TourAnchorIonPopoverDirective,
  ],
})
export class OrderPage implements ViewWillEnter {
  modalService = inject(ModalService);
  orderService = inject(OrderService);
  barCodeScannerService = inject(CodeReaderService);

  constructor() {
    addIcons({ addSharp, qrCode });
  }

  ionViewWillEnter() {
    this.orderService.getAll().subscribe();
  }

  addOrder() {
    this.modalService.openModal(OrderModalComponent);
  }

  async getCode() {
    let orderId = await this.barCodeScannerService.scanCode();

    if (!orderId) {
      return;
    }

    await this.modalService.openModal(OrderModalComponent, {
      orderId: orderId,
    });
  }
}
