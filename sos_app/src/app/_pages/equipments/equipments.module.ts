import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentsPageRoutingModule } from './equipments-routing.module';

import { EquipmentsPage } from './equipments.page';
import { EquipmentsListComponent } from './components/equipments-list/equipments-list.component';
import { EquipmentModalComponent } from './components/equipment-modal/equipment-modal.component';
import { EquipmentFilterComponent } from './components/equipment-filter/equipment-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    EquipmentsPage,
    EquipmentsListComponent,
    EquipmentModalComponent,
    EquipmentFilterComponent,
  ],
})
export class EquipmentsPageModule {}
