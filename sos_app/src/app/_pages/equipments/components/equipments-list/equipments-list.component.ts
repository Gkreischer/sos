import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from 'src/app/_models/Equipment';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'src/app/_services/modal.service';
import { EquipmentModalComponent } from '../equipment-modal/equipment-modal.component';

@Component({
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss'],
})
export class EquipmentsListComponent implements OnInit {
  equipments!: Observable<Equipment[]>;

  constructor(
    private equipmentService: EquipmentService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getEquipments();
  }

  getEquipments() {
    this.equipmentService.getEquipments().subscribe(() => {
      this.equipments = this.equipmentService.equipments;
    });
  }

  openModal(equipment: Equipment) {
    this.modalService.openModal(EquipmentModalComponent, {
      equipment: equipment,
    });
  }
}
