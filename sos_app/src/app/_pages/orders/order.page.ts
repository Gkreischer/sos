import { Component, inject, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderModalComponent } from './components/order-modal/order-modal.component';
import { OrderStatusInterface } from 'src/app/_interfaces/OrderStatusInterface';
import { IonicModule } from '@ionic/angular';
import { OrderFilterComponent } from './components/order-filter/order-filter.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderService } from 'src/app/_services/order.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  imports: [IonicModule, OrderFilterComponent, OrdersListComponent],
})
export class OrderPage implements ViewWillEnter {
  modalService = inject(ModalService);
  orderService = inject(OrderService);

  constructor() {}

  ionViewWillEnter() {
    this.orderService.getAll().subscribe();
  }

  addOrder() {
    this.modalService.openModal(OrderModalComponent);
  }
}
