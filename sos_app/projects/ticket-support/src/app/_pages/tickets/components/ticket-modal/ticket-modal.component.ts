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
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.css',
})
export class TicketModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  ticketService = inject(TicketService);

  form!: FormGroup;
  ticketId!: number;

  constructor() {
    addIcons({
      arrowBackSharp,
    });
  }

  ngOnInit() {
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

  mountForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
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
