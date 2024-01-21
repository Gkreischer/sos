import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { PipesModule } from 'src/app/_modules/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [UsersPage, UsersListComponent, UserModalComponent],
})
export class UsersPageModule {}
