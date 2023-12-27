import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.openModal(CategoryModalComponent);
  }

}
