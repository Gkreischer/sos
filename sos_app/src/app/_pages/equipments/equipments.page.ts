import { Component, inject, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalService } from 'src/app/_services/modal.service';
import { EquipmentModalComponent } from './components/equipment-modal/equipment-modal.component';

import { EquipmentFilterComponent } from './components/equipment-filter/equipment-filter.component';
import { EquipmentsListComponent } from './components/equipments-list/equipments-list.component';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { EquipmentInterface } from 'src/app/_interfaces/EquipmentInterface';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';

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
export class EquipmentsPage implements ViewWillEnter {
  modalService = inject(ModalService);
  equipmentService = inject(EquipmentService);
  constructor() {}

  ionViewWillEnter() {
    this.equipmentService.getEquipments().subscribe();
  }

  openModal() {
    this.modalService.openModal(EquipmentModalComponent);
  }
}
