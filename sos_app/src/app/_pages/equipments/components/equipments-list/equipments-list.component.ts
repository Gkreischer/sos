import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentInterface } from 'src/app/_interfaces/EquipmentInterface';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'src/app/_services/modal.service';
import { EquipmentModalComponent } from '../equipment-modal/equipment-modal.component';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { EquipmentFilterInterface } from 'src/app/_interfaces/EquipmentFilterInterface';
import { effect } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-equipments-list',
    templateUrl: './equipments-list.component.html',
    styleUrls: ['./equipments-list.component.scss'],
    imports: [IonicModule, AsyncPipe],
})
export class EquipmentsListComponent implements OnInit {
  equipmentService = inject(EquipmentService);
  modalService = inject(ModalService);

  equipments!: Observable<EquipmentInterface[]>;
  equipmentsPage = 1;
  infiniteScroll = signal(true);
  filters = this.equipmentService.equipmentFilter;

  constructor() {
    effect(() => {
      const filters = this.filters();

      this.equipmentsPage = 1;
      this.infiniteScroll.set(true);

      this.equipmentService
        .getEquipments(this.equipmentsPage, filters)
        .subscribe((res) => {
          this.equipments = this.equipmentService.equipments;

          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });
    });
  }

  ngOnInit() {}

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
        console.log(res);
        this.equipments = this.equipmentService.equipments;
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
        event.target.complete();
      });
  }
}
