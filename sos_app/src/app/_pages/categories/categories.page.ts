import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false,
})
export class CategoriesPage implements OnInit {
  modalService = inject(ModalService);

  constructor() {}

  ngOnInit() {}

  openModal() {
    this.modalService.openModal(CategoryModalComponent);
  }
}
