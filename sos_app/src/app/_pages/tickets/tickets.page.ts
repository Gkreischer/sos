import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
} from '@ionic/angular/standalone';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { TicketFilterComponent } from './components/ticket-filter/ticket-filter.component';
import { IonMenuButton } from '@ionic/angular/standalone';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { NotificationService } from 'shared';
import { inject } from '@angular/core';
@Component({
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
    TicketsListComponent,
    TicketFilterComponent,
    IonMenuButton,
  ],
})
export class TicketsPage implements ViewWillEnter, ViewWillLeave {
  notificationService = inject(NotificationService);

  ionViewWillEnter() {
    this.listenPrivateChannel();
  }

  listenPrivateChannel() {
    this.notificationService.listenPrivate('tickets', '.new.ticket', (data) => {
      console.log(data);
    });
  }

  ionViewWillLeave() {
    this.notificationService.leave('tickets');
  }

  constructor() {}

  ngOnInit() {}
}
