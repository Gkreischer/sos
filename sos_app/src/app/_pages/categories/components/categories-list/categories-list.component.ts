import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  imports: [IonicModule, AsyncPipe],
})
export class CategoriesListComponent implements OnInit {
  categoryService = inject(CategoryService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);
  categories?: Observable<CategoryInterface[]> =
    this.categoryService.categories;

  isLoading$ = this.loadingService.isLoading$;

  constructor() {}

  ngOnInit() {}

  openModal(category: CategoryInterface) {
    this.modalService.openModal(CategoryModalComponent, { category: category });
  }
}
