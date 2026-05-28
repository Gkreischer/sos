import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { EquipmentModalComponent } from './components/equipment-modal/equipment-modal.component';
import { IonicModule } from '@ionic/angular';
import { EquipmentFilterComponent } from './components/equipment-filter/equipment-filter.component';
import { EquipmentsListComponent } from './components/equipments-list/equipments-list.component';

@Component({
    selector: 'app-equipments',
    templateUrl: './equipments.page.html',
    styleUrls: ['./equipments.page.scss'],
    imports: [
        IonicModule,
        EquipmentFilterComponent,
        EquipmentsListComponent,
    ],
})
export class EquipmentsPage implements OnInit {
  modalService = inject(ModalService);

  constructor() {}

  ngOnInit() {}

  openModal() {
    this.modalService.openModal(EquipmentModalComponent);
  }
}
