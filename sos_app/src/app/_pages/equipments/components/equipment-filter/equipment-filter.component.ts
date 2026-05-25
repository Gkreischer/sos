import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipmentService } from 'src/app/_services/equipment.service';

@Component({
  selector: 'app-equipment-filter',
  templateUrl: './equipment-filter.component.html',
  styleUrls: ['./equipment-filter.component.scss'],
  standalone: false,
})
export class EquipmentFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  equipmentService = inject(EquipmentService);

  filterForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.filterForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
  }

  searchEquipment() {
    this.equipmentService.setEquipmentFilter(this.filterForm.value);
  }
}
