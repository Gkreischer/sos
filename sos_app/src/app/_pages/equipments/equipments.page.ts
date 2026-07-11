import { Component, inject } from '@angular/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { ModalService } from 'src/app/_services/modal.service';
import { EquipmentModalComponent } from './components/equipment-modal/equipment-modal.component';

import { EquipmentFilterComponent } from './components/equipment-filter/equipment-filter.component';
import { EquipmentsListComponent } from './components/equipments-list/equipments-list.component';
import { EquipmentService } from 'src/app/_services/equipment.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';
@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.page.html',
  styleUrls: ['./equipments.page.scss'],
  imports: [
    IonIcon,
    EquipmentFilterComponent,
    EquipmentsListComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonFab,
    IonFabButton,
  ],
})
export class EquipmentsPage implements ViewWillEnter, ViewWillLeave {
  modalService = inject(ModalService);
  equipmentService = inject(EquipmentService);
  constructor() {
    addIcons({ addSharp });
  }

  ionViewWillEnter() {
    this.equipmentService.getEquipments().subscribe();
  }

  ionViewWillLeave() {
    this.equipmentService.equipmentFilter.set(null);
    this.equipmentService.equipmentsSubject.next([]);
  }

  openModal() {
    this.modalService.openModal(EquipmentModalComponent);
  }
}
