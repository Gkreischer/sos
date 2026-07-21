import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastController = inject(ToastController);
  constructor() {}

  async presentToast(
    message = 'Insira uma mensagem',
    position: 'top' | 'middle' | 'bottom',
    duration: number,
    color: 'success' | 'danger' | 'warning',
  ) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: duration || 5000,
      position: position,
      color: color,
      cssClass: 'data-cy-toast-error',
    });

    await toast.present();
  }
}
