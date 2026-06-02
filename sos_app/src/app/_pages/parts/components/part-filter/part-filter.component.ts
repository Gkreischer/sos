import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PartService } from 'src/app/_services/part.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { AsyncPipe } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-part-filter',
  templateUrl: './part-filter.component.html',
  styleUrls: ['./part-filter.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class PartFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  partService = inject(PartService);
  loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;

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
