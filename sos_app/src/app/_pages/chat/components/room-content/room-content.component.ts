import { Component, OnInit, inject } from '@angular/core';
import {
  IonList,
  IonLabel,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonButton,
  IonTextarea,
  IonContent,
  IonFooter,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonAvatar,
  IonImg,
  IonCardSubtitle,
  IonNote,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { ModalService } from 'src/app/_services/modal.service';

import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoomInterface } from 'src/app/_interfaces/RoomInterface';
import { RoomService } from 'src/app/_services/room.service';
import { RoomMessageInterface } from 'src/app/_interfaces/RoomMessageInterface';
import { IonSpinner } from '@ionic/angular/standalone';
import { IonText } from '@ionic/angular/standalone';
import { NotificationService } from 'src/app/_services/notification.service';
import { LoginService } from 'src/app/_services/login.service';
import { AlertService } from 'src/app/_services/alert.service';
import { RoomModalComponent } from './../room-modal/room-modal.component';
@Component({
  selector: 'app-room-content',
  templateUrl: './room-content.component.html',
  styleUrls: ['./room-content.component.scss'],
  imports: [
    IonFabList,
    IonFabButton,
    IonFab,
    IonNote,
    IonImg,
    IonRow,
    IonGrid,
    IonCol,
    IonFooter,
    IonContent,
    IonTextarea,
    IonButton,
    IonButtons,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonHeader,
    AsyncPipe,
    ReactiveFormsModule,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonText,
    IonAvatar,
    IonLabel,
    IonItem,
    IonList,
  ],
})
export class RoomContentComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  loadingService = inject(LoadingService);
  roomService = inject(RoomService);
  notificationService = inject(NotificationService);
  loginService = inject(LoginService);
  alertService = inject(AlertService);

  user$ = this.loginService.user;
  isLoading$ = this.loadingService.isLoading$;

  form!: FormGroup;

  room?: RoomInterface;

  messages$: Observable<RoomMessageInterface[]> = this.roomService.messages;

  constructor() {}

  ngOnInit() {
    this.mountForm();
    if (this.room) {
      this.roomService.getRoomMessages(this.room.id).subscribe();
      this.enterChannelRoom();
    }
  }

  mountForm() {
    this.form = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  sendMessage() {
    this.roomService
      .sendRoomMessage(this.room!.id, this.form.value.content)
      .subscribe((res) => {
        this.form.reset();
      });
  }

  closeModal() {
    this.modalService.closeModal();
    this.leaveChannelRoom();
    this.roomService.messagesSubject.next([]);
  }

  leaveChannelRoom() {
    this.notificationService.leave(`room.${this.room!.id}`);
  }

  enterChannelRoom() {
    this.notificationService.listenPrivate(
      `room.${this.room!.id}`,
      '.message.sent',
      (data: RoomMessageInterface) => {
        this.roomService.addMessageInRoom(data);
      },
    );
  }

  deleteAlert() {
    let alert = this.alertService.presentAlert(
      'Atenção',
      '',
      'Essa operação irá deletar a sala e não poderá ser desfeita',
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.deleteRoom();
          },
          role: 'destructive',
          cssClass: 'primary',
        },
      ],
    );
  }

  editRoom() {
    this.modalService.openModal(RoomModalComponent, {
      roomId: this.room!.id,
    });
  }

  deleteRoom() {
    this.roomService.delete(this.room!.id).subscribe((res) => {
      this.leaveChannelRoom();
      this.roomService.messagesSubject.next([]);
      this.modalService.closeModal();
    });
  }
}
