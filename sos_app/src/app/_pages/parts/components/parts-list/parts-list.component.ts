import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PartInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { PartModalComponent } from '../part-modal/part-modal.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { effect, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { LoadingService } from 'shared';
import {
  IonInfiniteScroll,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonAvatar,
  IonImg,
  IonInfiniteScrollContent,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.scss'],
  imports: [
    IonText,
    IonNote,
    IonInfiniteScrollContent,
    IonImg,
    IonAvatar,
    IonSpinner,
    IonLabel,
    IonItem,
    IonList,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonInfiniteScroll,
    AsyncPipe,
    CurrencyPipe,
  ],
})
export class PartsListComponent {
  partService = inject(PartService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);

  parts: Observable<PartInterface[]> = this.partService.parts;
  partsPage: number = 1;
  infiniteScroll = signal(true);
  partFilters = this.partService.partFilters;

  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    effect((onCleanup) => {
      this.partsPage = 1;
      this.infiniteScroll.set(true);
      const partFilters = this.partService.partFilters();
      const subscription = this.getParts().subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  getParts() {
    return this.partService.getParts(this.partsPage);
  }

  getAll() {
    this.partService.getParts().subscribe(() => {
      this.parts = this.partService.parts;
    });
  }

  openModalEdit(part: PartInterface) {
    this.modalService.openModal(PartModalComponent, { partId: part.id });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.partsPage++;

    this.getParts().subscribe({
      next: (res) => {
        this.parts = this.partService.parts;

        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      },
      complete: () => {
        event.target.complete();
      },
    });
  }
}
