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
import { ModalService } from 'src/app/_services/modal.service';
import { RoomService } from 'src/app/_services/room.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { RoomInterface } from 'src/app/_interfaces/RoomInterface';
import { UserService } from 'src/app/_services/user.service';
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
    IonRow,
    IonGrid,
    IonCol,
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
  constructor() {}

  ionViewWillEnter() {
    this.getAllRooms();
    this.listenPrivateChannel();
  }

  ionViewWillLeave() {
    this.leaveChannel();
  }

  async openModalAddRoom() {
    let role = await this.modalService.openModal(RoomModalComponent);

    if (role === 'backdrop') {
      this.userService.usersSubject.next(null);
    }
  }

  getAllRooms() {
    this.roomService.getAll(1).subscribe();
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
    this.notificationService.leave('rooms');
  }
}
