import { Component, OnInit } from '@angular/core';
import { TicketService } from 'shared';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketInterface } from 'shared';
import {
  IonItem,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonSpinner,
  IonChip,
  IonIcon,
} from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'shared';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
@Component({
  selector: 'app-ticket-list',
  imports: [
    IonIcon,
    IonChip,
    IonSpinner,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonItem,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent implements OnInit {
  ticketService = inject(TicketService);
  loadingService = inject(LoadingService);
  modalService = inject(ModalService);

  tickets$: Observable<TicketInterface[] | null> = this.ticketService.tickets;
  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.getAllTickets();
  }

  getAllTickets() {
    this.ticketService.getUserTickets().subscribe();
  }

  openModalTicket(ticket: TicketInterface) {
    this.modalService.openModal(TicketModalComponent, { ticketId: ticket.id });
  }
}
