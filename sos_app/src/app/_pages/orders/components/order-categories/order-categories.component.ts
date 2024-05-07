import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Order } from 'src/app/_models/Order';
import { OrderStatus } from 'src/app/_models/OrderStatus';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss'],
})
export class OrderCategoriesComponent  implements OnInit {

  status!: Order['status'];
  @Output() statusSelected = new EventEmitter<OrderStatus>();

  constructor() { }

  ngOnInit() {}

  selectStatusOrders(event: Event) {
    let value = (event.target as SegmentChangeEventDetail).value!.toString();
    switch(value) {
      case 'opened':
        this.status = OrderStatus.CREATED;
        break;

      case 'started':
        this.status = OrderStatus.IN_PROGRESS;
        break;

      case 'finished':
        this.status = OrderStatus.FINISHED;
      break;
    }
    this.statusSelected.emit(this.status);
  }

}
