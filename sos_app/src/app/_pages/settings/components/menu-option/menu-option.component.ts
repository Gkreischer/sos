import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_services/modal.service';
import { BusinessInfoModalComponent } from '../business-info-modal/business-info-modal.component';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.scss'],
})
export class MenuOptionComponent implements OnInit {
  modalService = inject(ModalService);

  constructor() {}

  ngOnInit() {}

  openBussinessInfoModal() {
    this.modalService.openModal(BusinessInfoModalComponent);
  }
}
