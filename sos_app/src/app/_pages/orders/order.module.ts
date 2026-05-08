import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderModalComponent } from './components/order-modal/order-modal.component';
import { ModalAddPartComponent } from './components/modal-add-part/modal-add-part.component';
import { OrderFilterComponent } from './components/order-filter/order-filter.component';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    ReactiveFormsModule,
    MaskitoDirective,
  ],
  declarations: [
    OrderPage,
    OrdersListComponent,
    OrderModalComponent,
    ModalAddPartComponent,
    OrderFilterComponent,
  ],
})
export class OrderPageModule {}
