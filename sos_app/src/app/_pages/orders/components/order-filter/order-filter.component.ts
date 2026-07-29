import { Component, inject, OnInit, signal, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import { Observable } from 'rxjs';
import { OrderStatusInterface } from 'shared';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderService } from 'src/app/_services/order.service';

import { dateMask } from 'projects/shared/src/lib/_masks/dateMask';
import { MaskitoDirective } from '@maskito/angular';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
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
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
  imports: [
    IonIcon,
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

  constructor() {
    addIcons({ search });
  }

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
    this.orderStatusService.getOrderStatuses().subscribe();
  }
}
