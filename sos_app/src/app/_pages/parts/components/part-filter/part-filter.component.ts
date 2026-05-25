import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartService } from 'src/app/_services/part.service';

@Component({
  selector: 'app-part-filter',
  templateUrl: './part-filter.component.html',
  styleUrls: ['./part-filter.component.scss'],
  standalone: false,
})
export class PartFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  partService = inject(PartService);

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

  searchPart() {
    this.partService.setPartFilters(this.filterForm.value);
  }
}
