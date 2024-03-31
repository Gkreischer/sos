import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/_models/Order';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderService } from 'src/app/_services/order.service';
import { OrderModalComponent } from '../order-modal/order-modal.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent  implements OnInit {

  orders$?: Observable<Order[]>;

  constructor(
    private orderService: OrderService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.orderService.getAll().subscribe((orders) => {
      console.log(orders)
      this.orders$ = this.orderService.orders$;
    });
  }

  openModal(order: Order) {
    this.modalService.openModal(OrderModalComponent, { orderId: order.id });
  }

}
