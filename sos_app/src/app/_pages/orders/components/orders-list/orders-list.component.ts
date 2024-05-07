import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/_models/Order';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderService } from 'src/app/_services/order.service';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { OrderStatus } from 'src/app/_models/OrderStatus';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent  implements OnInit, OnChanges {

  orders$?: Observable<Order[]>;
  @Input() orderStatus?: OrderStatus;

  constructor(
    private orderService: OrderService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.getOpenedOrders();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.orderStatus = changes['orderStatus'].currentValue;

    this.filterByStatus(this.orderStatus!);
  }

  getOpenedOrders() {
    this.orderService.getOrdersStatusOpened().subscribe((orders) => {
      console.log(orders)
      this.orders$ = this.orderService.orders$;
    });
  }

  getInProgressOrders() {
    this.orderService.getOrdersStatusInProgress().subscribe((orders) => {
      this.orders$ = this.orderService.orders$;
    })
  }

  getFinishedOrders() {
    this.orderService.getOrdersStatusFinished().subscribe((orders) => {
      this.orders$ = this.orderService.orders$;
    })
  }

  filterByStatus(status: OrderStatus) {
    this.orderStatus = status;

    switch(status) {
      case OrderStatus.CREATED:
        this.getOpenedOrders();
        break;

      case OrderStatus.IN_PROGRESS:
        this.getInProgressOrders();  
      break;

      case OrderStatus.FINISHED:
        this.getFinishedOrders();
      break;
    }
  }



  openModal(order: Order) {
    this.modalService.openModal(OrderModalComponent, { orderId: order.id });
  }

}
