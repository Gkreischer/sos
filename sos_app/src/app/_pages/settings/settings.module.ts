import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { MenuOptionComponent } from './components/menu-option/menu-option.component';
import { BusinessInfoModalComponent } from './components/business-info-modal/business-info-modal.component';
import { MaskitoDirective } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ReactiveFormsModule,
    MaskitoDirective,
  ],
  declarations: [SettingsPage, MenuOptionComponent, BusinessInfoModalComponent],
})
export class SettingsPageModule {}
