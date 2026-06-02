import { Component, OnInit } from '@angular/core';
import { PostInterface } from 'src/app/_interfaces/PostInterface';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonNote,
  IonChip,
  IonText,
} from '@ionic/angular/standalone';
import { ModalService } from 'src/app/_services/modal.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
  imports: [
    IonText,
    IonChip,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonContent,
    IonIcon,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonCardTitle,
    IonCardSubtitle,
    DatePipe,
  ],
})
export class PostModalComponent implements OnInit {
  modalService = inject(ModalService);

  post!: PostInterface;

  constructor() {}

  ngOnInit() {
    console.log(this.post);
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
