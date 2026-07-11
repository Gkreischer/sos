import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { BarcodePrintComponent } from './components/barcode-print/barcode-print.component';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { addSharp } from 'ionicons/icons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonContent,
    IonTitle,
    IonIcon,
    IonButtons,
    IonToolbar,
    IonHeader,
    RouterLink,
    OrderPrintComponent,
    BarcodePrintComponent,
  ],
})
export class PrintPage {
  constructor() {
    addIcons({ arrowBack, addSharp });
  }
}
