import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import { Observable } from 'rxjs';
import { OrderStatusInterface } from 'src/app/_interfaces/OrderStatusInterface';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderService } from 'src/app/_services/order.service';

import { OrderFilter } from 'src/app/_interfaces/OrderFilter';
import dateMask from 'src/app/_masks/dateMask';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
  standalone: false,
})
export class OrderFilterComponent implements OnInit {
  orderService = inject(OrderService);

  orderStatusService = inject(OrderStatusService);
  formBuilder = inject(FormBuilder);
  ordersStatuses$?: Observable<OrderStatusInterface[]>;

  form!: FormGroup;

  dateMask = dateMask;

  enableInfiniteScroll = signal(true);

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
    this.orderService.setOrderFilter(this.form.value);
  }

  getOrderStatuses() {
    this.orderStatusService.getOrderStatuses().subscribe((data) => {
      this.ordersStatuses$ = this.orderStatusService.order_statuses;
    });
  }
}
