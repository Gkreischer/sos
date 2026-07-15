import { Component, inject, OnInit, signal, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import { Observable } from 'rxjs';
import { OrderStatusInterface } from 'src/app/_interfaces/OrderStatusInterface';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderService } from 'src/app/_services/order.service';

import { dateMask } from 'src/app/_masks/dateMask';
import { MaskitoDirective } from '@maskito/angular';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSelectOption,
  IonInput,
  IonSelect,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
  imports: [
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    IonSelectOption,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class OrderFilterComponent implements OnInit {
  orderService = inject(OrderService);

  orderStatusService = inject(OrderStatusService);
  formBuilder = inject(FormBuilder);
  ordersStatuses$?: Observable<OrderStatusInterface[]> =
    this.orderStatusService.order_statuses;
  loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;

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
    console.log(this.form.value);
    this.orderService.setOrderFilter(this.form.value);
  }

  getOrderStatuses() {
    this.orderStatusService.getOrderStatuses().subscribe();
  }
}
