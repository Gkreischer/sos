import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'shared';
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackSharp } from 'ionicons/icons';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TicketService } from 'shared';
import { LoadingService } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EquipmentService } from '@ticket/app/_services/equipment.service';
@Component({
  selector: 'app-ticket-modal',
  imports: [
    IonCardContent,
    IonCard,
    IonTextarea,
    IonCol,
    IonRow,
    IonGrid,
    IonInput,
    IonIcon,
    IonButtons,
    IonContent,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButton,
    ReactiveFormsModule,
    AsyncPipe,
    IonSelect,
    IonSelectOption,
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss',
})
export class TicketModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  ticketService = inject(TicketService);
  loadingService = inject(LoadingService);
  equipmentService = inject(EquipmentService);

  form!: FormGroup;
  ticketId!: number;
  equipments$: Observable<any> = this.equipmentService.equipments;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  constructor() {
    addIcons({
      arrowBackSharp,
    });
  }

  ngOnInit() {
    this.getCustomerEquipments();
    this.mountForm();
    if (this.ticketId) {
      this.getTicketInfoById();
    }
  }

  getTicketInfoById() {
    this.ticketService.getTicket(this.ticketId).subscribe((res) => {
      this.form.patchValue(res);
    });
  }

  getCustomerEquipments() {
    this.equipmentService.getCustomerEquipments().subscribe();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      equipment_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  submit() {
    this.ticketService.create(this.form.value).subscribe();
    this.closeModal();
  }
}
