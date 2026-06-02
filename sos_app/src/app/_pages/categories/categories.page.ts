import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { CategoryService } from 'src/app/_services/category.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  imports: [IonicModule, CategoriesListComponent],
})
export class CategoriesPage implements OnInit, ViewWillEnter {
  modalService = inject(ModalService);
  categoriesService = inject(CategoryService);
  constructor() {}

  ionViewWillEnter() {
    this.categoriesService.getCategories().subscribe();
  }

  ngOnInit() {}

  openModal() {
    this.modalService.openModal(CategoryModalComponent);
  }
}
