import { Component, inject, signal } from '@angular/core';
import { ModalService } from 'shared';
import {
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonContent,
  IonBackdrop,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
@Component({
  selector: 'lib-modal-image',
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonBackdrop,
    IonContent,
    IonImg,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
  ],
  templateUrl: './modal-image.component.html',
  styleUrl: './modal-image.component.scss',
})
export class ModalImageComponent {
  imageUrl = signal<string>('');
  modalService = inject(ModalService);

  constructor() {
    addIcons({ close });
    console.log(this.imageUrl());
  }

  closeModal() {
    this.modalService.closeModal();
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl.set(imageUrl);
  }
}
