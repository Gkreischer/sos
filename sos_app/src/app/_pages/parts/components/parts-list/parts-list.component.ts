import {Component, signal, ChangeDetectionStrategy, effect, inject, DestroyRef} from '@angular/core';
import { Observable } from 'rxjs';
import { PartInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { PartModalComponent } from '../part-modal/part-modal.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { LoadingService } from 'shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    private destroyRef = inject(DestroyRef);

constructor() {
    this.getParts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res.current_page >= res.last_page) {
        this.infiniteScroll.set(false);
      }
    });

    // Watch for filter changes and reset
    effect(() => {
      this.partsPage = 1;
      this.infiniteScroll.set(true);
      const partFilters = this.partService.partFilters();
      this.getParts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
    });
  }

  getParts() {
    return this.partService.getParts(this.partsPage);
  }

  getAll() {
    this.partService.getParts(1).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.infiniteScroll.set(res.current_page >= res.last_page);
    });
  }

  openModalEdit(part: PartInterface) {
    this.modalService.openModal(PartModalComponent, { partId: part.id });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.partsPage++;

    this.getParts().subscribe({
      next: (res) => {
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
