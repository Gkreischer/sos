import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { EquipmentsListComponent } from './components/equipments-list/equipments-list.component';
import { EquipmentFilterComponent } from './components/equipment-filter/equipment-filter.component';
import { ModalService } from 'shared';
import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';
import { EquipmentModalComponent } from './components/equipment-modal/equipment-modal.component';
@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.page.html',
  styleUrls: ['./equipments.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    EquipmentsListComponent,
    EquipmentFilterComponent,
  ],
})
export class EquipmentsPage implements OnInit {
  modalService = inject(ModalService);
  constructor() {
    addIcons({ addSharp });
  }

  ngOnInit() {}

  openModalAddEquipment() {
    this.modalService.openModal(EquipmentModalComponent);
  }
}
