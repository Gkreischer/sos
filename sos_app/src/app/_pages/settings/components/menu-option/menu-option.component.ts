import { Component, inject } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { BusinessInfoModalComponent } from '../business-info-modal/business-info-modal.component';
import { UserInfoModalComponent } from '../user-info-modal/user-info-modal.component';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.scss'],
  imports: [
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
  ],
})
export class MenuOptionComponent {
  modalService = inject(ModalService);

  constructor() {}

  openBussinessInfoModal() {
    this.modalService.openModal(BusinessInfoModalComponent);
  }

  openUserModalInfo() {
    this.modalService.openModal(UserInfoModalComponent);
  }
}
