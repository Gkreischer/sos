import { Component, inject, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonCardTitle,
  IonSelectOption,
  IonSelect,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import { MaskitoDirective } from '@maskito/angular';
import { dateMask } from 'src/app/_masks/dateMask';
import { MaskitoElementPredicate } from '@maskito/core';
import { TicketService } from 'src/app/_services/ticket.service';
@Component({
  selector: 'app-ticket-filter',
  imports: [
    IonButton,
    IonInput,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardHeader,
    IonCard,
    ReactiveFormsModule,
    IonCardTitle,
    IonCardContent,
    IonSelectOption,
    AsyncPipe,
    MaskitoDirective,
    IonSelect,
  ],
  templateUrl: './ticket-filter.component.html',
  styleUrl: './ticket-filter.component.css',
})
export class TicketFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  orderStatusService = inject(OrderStatusService);
  loadingService = inject(LoadingService);
  ticketService = inject(TicketService);

  form!: FormGroup;
  ordersStatuses$ = this.orderStatusService.order_statuses;
  isLoading$ = this.loadingService.isLoading$;

  dateMask = dateMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  ngOnInit() {
    this.getOrderStatuses();
    this.mountForm();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      search: [''],
      status_id: [''],
      start_date: [''],
      end_date: [''],
    });
  }

  getOrderStatuses() {
    this.orderStatusService.getOrderStatuses().subscribe();
  }

  search() {
    this.ticketService.setTicketFilter(this.form.value);
  }
}
