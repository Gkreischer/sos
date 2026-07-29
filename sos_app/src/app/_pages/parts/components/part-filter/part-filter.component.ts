import { Component, inject, OnInit, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PartService } from 'src/app/_services/part.service';
import { LoadingService } from 'shared';
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
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
@Component({
  selector: 'app-part-filter',
  templateUrl: './part-filter.component.html',
  styleUrls: ['./part-filter.component.scss'],
  imports: [
    IonIcon,
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

  constructor() {
    addIcons({ search });
  }

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.filterForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });

    this.filterForm.get('description')?.valueChanges.subscribe((value) => {
      if (!value.trim()) {
        this.partService.setPartFilters({
          description: '',
        });
      }
    });
  }

  searchPart() {
    this.partService.setPartFilters(this.filterForm.value);
  }
}
