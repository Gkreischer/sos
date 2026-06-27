import { Component, OnInit, signal } from '@angular/core';
import { RoomService } from 'src/app/_services/room.service';
import { inject } from '@angular/core';
import { RoomInterface } from 'src/app/_interfaces/RoomInterface';
import { Observable } from 'rxjs';
import {
  IonList,
  IonItem,
  IonSkeletonText,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
  IonAvatar,
  IonImg,
} from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
import { ModalService } from 'src/app/_services/modal.service';
import { RoomContentComponent } from '../room-message/room-content.component';
import { effect } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/core';
@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  imports: [
    IonImg,
    IonAvatar,
    IonNote,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonCardHeader,
    IonCardContent,
    IonCard,
    IonLabel,
    IonItem,
    IonList,
    AsyncPipe,
    IonCardTitle,
    IonSpinner,
    IonNote,
  ],
})
export class RoomListComponent implements OnInit {
  roomService = inject(RoomService);
  loadingService = inject(LoadingService);
  modalService = inject(ModalService);
  rooms$: Observable<RoomInterface[]> = this.roomService.rooms;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  infiniteScroll = signal(true);
  roomsPage = 1;

  constructor() {}

  ngOnInit() {}

  async openRoom(room: RoomInterface) {
    let modal = await this.modalService.openModal(RoomContentComponent, {
      room: room,
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.roomsPage++;
    this.roomService.getAll(this.roomsPage).subscribe((res) => {
      console.log(res);
      if (res.current_page >= res.last_page) {
        this.infiniteScroll.set(false);
      }
      event.target.complete();
    });
  }
}
