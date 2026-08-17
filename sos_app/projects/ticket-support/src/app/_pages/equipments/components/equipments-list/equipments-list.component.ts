import {Component, inject, signal, ChangeDetectionStrategy, effect, DestroyRef} from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentInterface } from 'shared';
import { EquipmentService } from '@ticket/app/_services/equipment.service';
import { ModalService } from 'shared';
import { EquipmentModalComponent } from '../equipment-modal/equipment-modal.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonLabel,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss'],
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonSpinner,
    IonLabel,
    IonList,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonItem,
    AsyncPipe,
  ],
})
export class EquipmentsListComponent {
  equipmentService = inject(EquipmentService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);

  equipments: Observable<EquipmentInterface[]> =
    this.equipmentService.equipments;
  equipmentsPage = 1;
  infiniteScroll = signal(true);
  filters = this.equipmentService.equipmentFilter;
  isLoading$ = this.loadingService.isLoading$;

    private destroyRef = inject(DestroyRef);

constructor() {
    this.equipmentService
      .getCustomerEquipments(this.equipmentsPage, this.filters())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });

    // Watch for filter changes and reset
    effect(() => {
      const filters = this.filters();
      this.equipmentsPage = 1;
      this.infiniteScroll.set(true);

      this.equipmentService
        .getCustomerEquipments(this.equipmentsPage, filters)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });
    });
  }

  openModal(equipment: EquipmentInterface) {
    this.modalService.openModal(EquipmentModalComponent, {
      equipment: equipment,
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.equipmentsPage++;
    this.equipmentService
      .getCustomerEquipments(this.equipmentsPage, this.filters())
      .subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
        event.target.complete();
      });
  }
}
