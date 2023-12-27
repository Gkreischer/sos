import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent  implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalService.closeModal();
  }

}
