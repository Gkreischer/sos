import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { MaskitoDirective } from '@maskito/angular';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { FormatPhonePipe } from 'src/app/_pipes/format-phone.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    ReactiveFormsModule,
    MaskitoDirective,
    FormatPhonePipe,
  ],
  declarations: [
    UsersPage,
    UsersListComponent,
    UserModalComponent,
    UserFilterComponent,
  ],
})
export class UsersPageModule {}
