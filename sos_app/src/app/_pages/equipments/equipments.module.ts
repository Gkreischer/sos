import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentsPageRoutingModule } from './equipments-routing.module';

import { EquipmentsPage } from './equipments.page';
import { EquipmentsListComponent } from './components/equipments-list/equipments-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentsPageRoutingModule
  ],
  declarations: [EquipmentsPage, EquipmentsListComponent]
})
export class EquipmentsPageModule {}
