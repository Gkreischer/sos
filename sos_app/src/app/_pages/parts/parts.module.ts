import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartsPageRoutingModule } from './parts-routing.module';

import { PartsPage } from './parts.page';
import { PartsListComponent } from './components/parts-list/parts-list.component';
import { PartModalComponent } from './components/part-modal/part-modal.component';
import { MaskitoDirective } from '@maskito/angular';
import { PartFilterComponent } from './components/part-filter/part-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartsPageRoutingModule,
    ReactiveFormsModule,
    MaskitoDirective,
  ],
  declarations: [
    PartsPage,
    PartsListComponent,
    PartModalComponent,
    PartFilterComponent,
  ],
})
export class PartsPageModule {}
