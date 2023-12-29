import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async presentAlert(
    header: string = 'Insira um header',
    subheader: string = 'Insira um subheader',
    message: string = 'Insira uma mensagem',
    buttons: AlertButton[] = []
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: buttons,
    });

    return await alert.present();
  }
}
