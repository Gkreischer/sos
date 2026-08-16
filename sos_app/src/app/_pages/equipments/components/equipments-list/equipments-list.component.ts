import {Component, inject, signal, ChangeDetectionStrategy, effect, DestroyRef} from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentInterface } from 'shared';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
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
  IonText,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person } from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss'],
  imports: [
    IonText,
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
    IonNote,
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
    addIcons({ person });
    this.equipmentService
      .getEquipments(this.equipmentsPage, this.filters())
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
        .getEquipments(this.equipmentsPage, filters)
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
      .getEquipments(this.equipmentsPage, this.filters())
      .subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
        event.target.complete();
      });
  }
}
