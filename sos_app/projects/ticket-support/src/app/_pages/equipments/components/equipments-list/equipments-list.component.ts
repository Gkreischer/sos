import { Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentInterface } from 'shared';
import { EquipmentService } from '@ticket/app/_services/equipment.service';
import { ModalService } from 'shared';
import { EquipmentModalComponent } from '../equipment-modal/equipment-modal.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { effect } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
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

  constructor() {
    effect((onCleanup) => {
      const filters = this.filters();

      this.equipmentsPage = 1;
      this.infiniteScroll.set(true);

      const subscription = this.equipmentService
        .getCustomerEquipments(this.equipmentsPage, filters)
        .subscribe((res) => {
          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });
      onCleanup(() => {
        subscription.unsubscribe();
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
