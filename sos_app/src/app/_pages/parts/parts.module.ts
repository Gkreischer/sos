import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartsPageRoutingModule } from './parts-routing.module';

import { PartsPage } from './parts.page';
import { PartsListComponent } from './components/parts-list/parts-list.component';
import { PartModalComponent } from './components/part-modal/part-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartsPageRoutingModule
  ],
  declarations: [PartsPage, PartsListComponent, PartModalComponent]
})
export class PartsPageModule {}
