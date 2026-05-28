import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { IonicModule } from '@ionic/angular';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
    imports: [IonicModule, CategoriesListComponent],
})
export class CategoriesPage implements OnInit {
  modalService = inject(ModalService);

  constructor() {}

  ngOnInit() {}

  openModal() {
    this.modalService.openModal(CategoryModalComponent);
  }
}
