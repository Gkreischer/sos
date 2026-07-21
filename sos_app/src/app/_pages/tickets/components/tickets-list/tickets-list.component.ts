import {
  Component,
  inject,
  OnInit,
  effect,
  Signal,
  signal,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonSpinner,
  IonChip,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { TicketService } from 'src/app/_services/ticket.service';
import { TicketInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
import { addIcons } from 'ionicons';
import { person, calendar } from 'ionicons/icons';
import { TicketFilterInterface } from 'shared';
import { InfiniteScrollCustomEvent } from '@ionic/core';
@Component({
  selector: 'app-tickets-list',
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    IonChip,
    IonCardHeader,
    IonCardTitle,
    IonLabel,
    IonItem,
    IonList,
    IonCardContent,
    IonCard,
    IonCardSubtitle,
    AsyncPipe,
    IonSpinner,
    DatePipe,
  ],
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.css',
})
export class TicketsListComponent implements OnInit {
  ticketService = inject(TicketService);
  loadingService = inject(LoadingService);
  modalService = inject(ModalService);

  tickets$: Observable<TicketInterface[] | null> = this.ticketService.tickets;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  ticketFilters: Signal<TicketFilterInterface | null> =
    this.ticketService.ticketFilters;

  ticketsPage: number = 1;
  infiniteScroll = signal(true);

  constructor() {
    addIcons({
      person,
      calendar,
    });
    effect((onCleanup) => {
      const filters = this.ticketFilters();

      this.ticketsPage = 1;
      this.infiniteScroll.set(true);

      const subscription = this.ticketService
        .getAll(this.ticketsPage, filters ?? undefined)
        .subscribe((res) => {
          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });
      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  ngOnInit() {}

  openModalTicket(ticket: TicketInterface) {
    this.modalService.openModal(TicketModalComponent, { ticketId: ticket.id });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.ticketsPage++;

    this.ticketService
      .getAll(this.ticketsPage, this.ticketService.ticketFilters())
      .subscribe((res) => {
        event.target.complete();
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
  }
}
