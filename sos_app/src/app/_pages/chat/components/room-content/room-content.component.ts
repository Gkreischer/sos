import {Component, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
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
  IonAvatar,
  IonImg,
  IonNote,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';

import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoomInterface } from 'shared';
import { RoomService } from 'src/app/_services/room.service';
import { RoomMessageInterface } from 'shared';
import { IonSpinner } from '@ionic/angular/standalone';
import { IonText } from '@ionic/angular/standalone';
import { NotificationService } from 'shared';
import { LoginService } from 'shared';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { RoomModalComponent } from './../room-modal/room-modal.component';
import { addIcons } from 'ionicons';
import { addSharp, trashSharp, pencilSharp, arrowBack } from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    DatePipe,
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

  constructor() {
    addIcons({ addSharp, trashSharp, pencilSharp, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
    if (this.room) {
      this.roomService.getRoomMessages(this.room.id).subscribe({
        next: (messages) => {
          this.enterChannelRoom();
        },
        error: (err) => {
          this.modalService.closeModal();
        },
      });
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
