import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import { Observable } from 'rxjs';
import { dateMask } from 'src/app/_masks/dateMask';
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

  dateMask = dateMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

  ngOnInit() {
    this.mountForm();
    this.getOrderStatuses();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      status_id: [''],
      search: [''],
      start_date: [''],
      end_date: [''],
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
