import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  standalone: false,
})
export class CategoriesListComponent implements OnInit {
  categoryService = inject(CategoryService);
  modalService = inject(ModalService);

  categories?: Observable<CategoryInterface[]>;

  constructor() {}

  ngOnInit() {
    this.getCategories();
  }

  openModal(category: CategoryInterface) {
    this.modalService.openModal(CategoryModalComponent, { category: category });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((res) => {
      console.log(res);
      this.categories = this.categoryService.categories;
    });
  }
}
