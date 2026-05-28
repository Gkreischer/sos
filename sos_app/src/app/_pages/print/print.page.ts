import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from 'src/app/_services/order.service';
import { OrderModalComponent } from '../orders/components/order-modal/order-modal.component';
import { ModalService } from 'src/app/_services/modal.service';
import { IonicModule } from '@ionic/angular';
import { OrderPrintComponent } from './components/order-print/order-print.component';

@Component({
    selector: 'app-print',
    templateUrl: './print.page.html',
    styleUrls: ['./print.page.scss'],
    imports: [
        IonicModule,
        RouterLink,
        OrderPrintComponent,
    ],
})
export class PrintPage implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  orderService = inject(OrderService);
  modalService = inject(ModalService);
  constructor() {}

  ngOnInit() {
    this.getOrder();
  }

  getOrderId() {
    return this.activatedRoute.snapshot.paramMap.get('id') ?? null;
  }

  getOrder() {
    const orderId = this.getOrderId();
    if (orderId) {
      return this.orderService.getById(+orderId).subscribe((order) => {
        return order;
      });
    }
    return null;
  }
}
