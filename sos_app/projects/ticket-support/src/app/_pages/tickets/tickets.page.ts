import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { TicketModalComponent } from './components/ticket-modal/ticket-modal.component';
import { ModalService } from 'shared';
import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';
import { NotificationService } from 'shared';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonGrid,
    IonCol,
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TicketListComponent,
  ],
})
export class TicketsPage {
  modalService = inject(ModalService);
  notificationService = inject(NotificationService);

  constructor() {
    addIcons({
      addSharp,
    });
  }

  openModalTicket() {
    this.modalService.openModal(TicketModalComponent);
  }
}
