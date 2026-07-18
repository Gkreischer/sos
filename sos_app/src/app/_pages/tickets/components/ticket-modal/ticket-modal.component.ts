import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardContent,
  IonCard,
  IonRow,
  IonCol,
  IonItem,
  IonGrid,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ModalService } from 'src/app/_services/modal.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { TicketInterface } from 'src/app/_interfaces/TicketInterface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderStatusInterface } from 'src/app/_interfaces/OrderStatusInterface';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-ticket-modal',
  imports: [
    IonTextarea,
    IonInput,
    IonCardTitle,
    IonCardHeader,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonCardContent,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonButtons,
    IonIcon,
    IonButton,
    AsyncPipe,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.css',
})
export class TicketModalComponent implements OnInit {
  modalService = inject(ModalService);
  ticketService = inject(TicketService);
  orderStatusService = inject(OrderStatusService);
  formBuilder = inject(FormBuilder);

  ticketId?: number;

  ticket$: Observable<TicketInterface | null> = this.ticketService.ticket;
  ticketStatuses$: Observable<OrderStatusInterface[]> =
    this.orderStatusService.order_statuses;

  form!: FormGroup;

  ngOnInit() {
    this.getTicketStatuses();
    this.mountForm();
    if (this.ticketId) {
      this.getTicketInfo();
    }
  }

  mountForm() {
    this.form = this.formBuilder.group({
      title: [''],
      description: [''],
      status_id: [''],
      user_id: [''],
      user: [{ value: '', disabled: true }],
    });
  }

  getTicketStatuses() {
    this.orderStatusService
      .getOrderStatuses()
      .subscribe((res) => console.log(res));
  }

  getTicketInfo() {
    this.ticketService
      .getTicket(this.ticketId!)
      .subscribe((res) => this.patchForm(res));
  }

  patchForm(ticket: TicketInterface) {
    console.log(ticket);
    this.form.patchValue({
      ...ticket,
      user: ticket.user.name,
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
