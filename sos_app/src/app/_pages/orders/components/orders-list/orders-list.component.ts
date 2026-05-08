import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/_models/Order';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderService } from 'src/app/_services/order.service';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { OrderStatus } from 'src/app/_models/OrderStatus';
import { map } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  orders$?: Observable<Order[]>;

  constructor(
    private orderService: OrderService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderService.getAll().subscribe((orders) => {
      console.log('orders', orders);
      this.orders$ = this.orderService.orders$;
    });
  }

  openModal(order: Order) {
    this.modalService.openModal(
      OrderModalComponent,
      { orderId: order.id },
      'full-modal',
    );
  }

  trackById(index: number, item: Order) {
    return item.id;
  }
}
