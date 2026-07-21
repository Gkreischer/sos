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
} from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'shared';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
@Component({
  selector: 'app-ticket-list',
  imports: [
    IonSpinner,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonItem,
    AsyncPipe,
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
})
export class TicketListComponent implements OnInit {
  ticketService = inject(TicketService);
  loadingService = inject(LoadingService);
  modalService = inject(ModalService);

  tickets$: Observable<TicketInterface[] | null> = this.ticketService.tickets;
  isLoading$ = this.loadingService.isLoading$;

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
