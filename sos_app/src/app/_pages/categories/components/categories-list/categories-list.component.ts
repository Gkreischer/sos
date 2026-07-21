import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'shared';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSpinner,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  imports: [
    IonList,
    IonSpinner,
    IonLabel,
    IonItem,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    AsyncPipe,
  ],
})
export class CategoriesListComponent {
  categoryService = inject(CategoryService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);
  categories?: Observable<CategoryInterface[]> =
    this.categoryService.categories;

  isLoading$ = this.loadingService.isLoading$;

  constructor() {}

  openModal(category: CategoryInterface) {
    this.modalService.openModal(CategoryModalComponent, { category: category });
  }
}
