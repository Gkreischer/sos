import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintPageRoutingModule } from './print-routing.module';

import { PrintPage } from './print.page';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { NgxPrintDirective } from 'ngx-print';
import { FormatPhonePipe } from 'src/app/_pipes/format-phone.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintPageRoutingModule,
    NgxPrintDirective,
    FormatPhonePipe,
  ],
  declarations: [PrintPage, OrderPrintComponent],
})
export class PrintPageModule {}
