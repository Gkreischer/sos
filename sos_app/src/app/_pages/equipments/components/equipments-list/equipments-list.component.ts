import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from 'src/app/_models/Equipment';
import { EquipmentService } from 'src/app/_services/equipment.service';

@Component({
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss'],
})
export class EquipmentsListComponent implements OnInit {
  equipments!: Observable<Equipment[]>;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit() {
    this.getEquipments();
  }

  getEquipments() {
    this.equipmentService.getEquipments().subscribe(() => {
      this.equipments = this.equipmentService.equipments;
    });
  }
}
