import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { EquipmentModalComponent } from './components/equipment-modal/equipment-modal.component';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.page.html',
  styleUrls: ['./equipments.page.scss'],
  standalone: false,
})
export class EquipmentsPage implements OnInit {
  modalService = inject(ModalService);

  constructor() {}

  ngOnInit() {}

  openModal() {
    this.modalService.openModal(EquipmentModalComponent);
  }
}
