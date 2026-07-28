import { Component, OnInit, signal } from '@angular/core';
import { RoomService } from 'src/app/_services/room.service';
import { inject } from '@angular/core';
import { RoomInterface } from 'shared';
import { Observable } from 'rxjs';
import {
  IonList,
  IonItem,
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
  IonCardSubtitle,
  IonText,
} from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { RoomContentComponent } from './../room-content/room-content.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  imports: [
    IonText,
    IonCardSubtitle,
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

  ngOnInit() {
    this.loadRooms();
  }

  async openRoom(room: RoomInterface) {
    let modal = await this.modalService.openModal(RoomContentComponent, {
      room: room,
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.roomsPage++;

    this.roomService.getAll(this.roomsPage).subscribe({
      next: (res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }

        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  private loadRooms() {
    this.roomsPage = 1;
    this.infiniteScroll.set(true);

    this.roomService.getAll(this.roomsPage).subscribe((res) => {
      if (res.current_page >= res.last_page) {
        this.infiniteScroll.set(false);
      }
    });
  }
}
