import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { PipesModule } from 'src/app/_modules/pipes/pipes.module';
import { MaskitoDirective } from '@maskito/angular';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserFilterComponent } from './components/user-filter/user-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    PipesModule,
    ReactiveFormsModule,
    MaskitoDirective,
  ],
  declarations: [
    UsersPage,
    UsersListComponent,
    UserModalComponent,
    UserFilterComponent,
  ],
})
export class UsersPageModule {}
