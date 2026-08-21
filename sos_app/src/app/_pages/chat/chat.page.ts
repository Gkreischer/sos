import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAccordion,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { RoomListComponent } from './components/room-list/room-list.component';
import { RoomModalComponent } from './components/room-modal/room-modal.component';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { RoomService } from 'src/app/_services/room.service';
import { NotificationService } from 'shared';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { RoomInterface } from 'shared';
import { UserService } from 'src/app/_services/user.service';
import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RoomListComponent,
    IonButtons,
    IonMenuButton,
  ],
})
export class ChatPage implements ViewWillEnter, ViewWillLeave {
  modalService = inject(ModalService);
  roomService = inject(RoomService);
  notificationService = inject(NotificationService);
  userService = inject(UserService);

  constructor() {
    addIcons({ addSharp });
  }

  ionViewWillEnter() {
    this.listenPrivateChannel();
  }

  ionViewWillLeave() {
    this.leaveChannel();
  }

  async openModalAddRoom() {
    const role = await this.modalService.openModal(RoomModalComponent);

    if (role === 'backdrop') {
      this.userService.usersSubject.next(null);
    }
  }

  listenPrivateChannel() {
    this.notificationService.listenPrivate<RoomInterface>(
      'rooms',
      '.new.room',
      (data: RoomInterface) => {
        this.roomService.addRoomInList(data);
      },
    );
  }

  leaveChannel() {
    this.notificationService.leavePrivate('rooms');
  }
}
