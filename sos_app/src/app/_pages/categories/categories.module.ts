import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesPageRoutingModule } from './categories-routing.module';

import { CategoriesPage } from './categories.page';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CategoriesPage,
    CategoriesListComponent,
    CategoryModalComponent,
  ],
})
export class CategoriesPageModule {}
