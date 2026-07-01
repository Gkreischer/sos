import { Component, inject, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderModalComponent } from './components/order-modal/order-modal.component';

import { IonicModule } from '@ionic/angular';
import { OrderFilterComponent } from './components/order-filter/order-filter.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderService } from 'src/app/_services/order.service';
import { TourAnchorIonPopoverDirective } from 'ngx-ui-tour-ionic';
import { CodeReaderService } from 'src/app/_services/code-reader.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  imports: [
    IonicModule,
    OrderFilterComponent,
    OrdersListComponent,
    TourAnchorIonPopoverDirective,
  ],
})
export class OrderPage implements ViewWillEnter {
  modalService = inject(ModalService);
  orderService = inject(OrderService);
  barCodeScannerService = inject(CodeReaderService);

  constructor() {}

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
