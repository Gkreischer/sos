import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { TicketFilterComponent } from './components/ticket-filter/ticket-filter.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [
      IonButtons,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      CommonModule,
      FormsModule,
      IonMenuButton,
      IonSpinner,
      TicketsListComponent,
      TicketFilterComponent,
    ],
})
export class TicketsPage {}
