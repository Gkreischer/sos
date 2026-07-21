import { Component, inject } from '@angular/core';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { ViewWillEnter } from '@ionic/angular';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { CategoryService } from 'src/app/_services/category.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonMenuButton,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    CategoriesListComponent,
    IonMenuButton,
  ],
})
export class CategoriesPage implements ViewWillEnter {
  modalService = inject(ModalService);
  categoriesService = inject(CategoryService);
  constructor() {
    addIcons({ addSharp });
  }

  ionViewWillEnter() {
    this.categoriesService.getCategories().subscribe();
  }

  openModal() {
    this.modalService.openModal(CategoryModalComponent);
  }
}
