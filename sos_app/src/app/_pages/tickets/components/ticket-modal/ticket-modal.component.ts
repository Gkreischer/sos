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
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { TicketInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderStatusInterface } from 'shared';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { EquipmentInterface } from 'shared';
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
  styleUrl: './ticket-modal.component.scss',
})
export class TicketModalComponent implements OnInit {
  modalService = inject(ModalService);
  ticketService = inject(TicketService);
  orderStatusService = inject(OrderStatusService);
  equipmentService = inject(EquipmentService);
  formBuilder = inject(FormBuilder);

  ticketId?: number;

  ticket$: Observable<TicketInterface | null> = this.ticketService.ticket;
  ticketStatuses$: Observable<OrderStatusInterface[]> =
    this.orderStatusService.order_statuses;
  equipments$: Observable<EquipmentInterface[]> =
    this.equipmentService.equipments;
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
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      equipment_id: ['', [Validators.required]],
      user: [{ value: '', disabled: true }],
    });
  }

  getUserEquipments() {
    const userId = this.form.get('user_id')?.value;

    if (!userId) {
      return;
    }

    this.equipmentService.getUserEquipments(userId).subscribe();
  }

  getTicketStatuses() {
    this.orderStatusService.getOrderStatuses().subscribe();
  }

  getTicketInfo() {
    this.ticketService.getTicket(this.ticketId!).subscribe((res) => {
      this.patchForm(res);
      console.log(res);
    });
  }

  patchForm(ticket: TicketInterface) {
    this.form.patchValue({
      title: ticket.title,
      description: ticket.description,
      status_id: ticket.status_id,
      user_id: ticket.user_id,
      equipment_id: ticket.equipment_id,
      user: ticket.user.name,
    });

    this.getUserEquipments();
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
