import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(
    message = 'Insira uma mensagem',
    position: 'top' | 'middle' | 'bottom',
    duration: number = 2000,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: duration,
      position: position,
      color: color,
    });

    await toast.present();
  }
}
