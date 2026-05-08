import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OrderStatus } from 'src/app/_models/OrderStatus';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
})
export class OrderFilterComponent implements OnInit {
  orderService = inject(OrderService);

  orderStatusService = inject(OrderStatusService);
  formBuilder = inject(FormBuilder);
  ordersStatuses$?: Observable<OrderStatus[]>;

  form!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.mountForm();
    this.getOrderStatuses();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      status_id: [''],
      search: [''],
    });
  }

  search() {
    this.orderService.getOrderByFilter(this.form.value).subscribe((orders) => {
      console.log('orders searched', orders);
    });
  }

  getOrderStatuses() {
    this.orderStatusService.getOrderStatuses().subscribe((data) => {
      console.log('order Statuses', data);
      this.ordersStatuses$ = this.orderStatusService.order_statuses;
    });
  }
}
