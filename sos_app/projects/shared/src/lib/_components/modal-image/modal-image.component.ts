import { Component, inject, signal, OnInit } from '@angular/core';
import { ModalService } from 'shared';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonContent,
  IonCard,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
@Component({
  selector: 'lib-modal-image',
  imports: [
    IonCard,
    IonContent,
    IonImg,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
  ],
  templateUrl: './modal-image.component.html',
  styleUrl: './modal-image.component.css',
})
export class ModalImageComponent {
  imageUrl = signal<string>('');
  modalService = inject(ModalService);

  constructor() {
    addIcons({ close });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl.set(imageUrl);
  }
}
