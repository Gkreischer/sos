import { Component, inject, OnInit, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EquipmentService } from 'src/app/_services/equipment.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonCol,
  IonButton,
  IonGrid,
  IonRow,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { LoadingService } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
@Component({
  selector: 'app-equipment-filter',
  templateUrl: './equipment-filter.component.html',
  styleUrls: ['./equipment-filter.component.scss'],
  imports: [
    IonIcon,
    IonRow,
    IonGrid,
    IonButton,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonCol,
    IonInput,
  ],
})
export class EquipmentFilterComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  equipmentService = inject(EquipmentService);
  loadingService = inject(LoadingService);
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;
  filterForm!: FormGroup;

  constructor() {
    addIcons({ search });
    effect(() => {
      const filters = this.equipmentService.equipmentFilter();

      if (!filters && this.filterForm) {
        this.filterForm.reset({
          description: '',
        });
      }
    });
  }

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.filterForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });

    this.filterForm.get('description')?.valueChanges.subscribe((value) => {
      if (!value?.trim()) {
        this.equipmentService.setEquipmentFilter({
          description: '',
        });
      }
    });
  }

  searchEquipment() {
    this.equipmentService.setEquipmentFilter(this.filterForm.value);
  }

  resetDataOnBlank(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (target.value === '') {
      this.equipmentService.setEquipmentFilter(null);
    }
  }
}
