import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async openModal(component: any, props?: Object) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: props,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
