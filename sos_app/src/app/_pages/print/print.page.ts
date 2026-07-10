import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { BarcodePrintComponent } from './components/barcode-print/barcode-print.component';
@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
  imports: [
    IonicModule,
    RouterLink,
    OrderPrintComponent,
    BarcodePrintComponent,
  ],
})
export class PrintPage {
  constructor() {}
}
