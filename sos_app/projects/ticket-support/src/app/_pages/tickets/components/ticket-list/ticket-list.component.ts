import { Component, signal, OnInit } from '@angular/core';
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'shared';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { InfiniteScrollCustomEvent } from '@ionic/core';
@Component({
  selector: 'app-ticket-list',
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
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

  infiniteScroll = signal(true);
  ticketsPage = 1;

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

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.ticketsPage++;

    this.ticketService.getUserTickets(this.ticketsPage).subscribe({
      next: (res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }

        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }
}
