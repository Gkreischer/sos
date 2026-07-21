import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalController = inject(ModalController);
  constructor() {}

  async openModal(component: any, props?: Object, cssClass?: string) {
    const modal = await this.modalController.create({
      component,
      componentProps: props,
      cssClass: cssClass ?? '',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      return data;
    }

    return null;
  }

  async closeModal(data?: any, role?: 'confirm' | 'cancel') {
    await this.modalController.dismiss(data, role);
  }
}
