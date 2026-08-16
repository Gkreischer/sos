import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'shared';
import { EquipmentInterface } from 'shared';
import { CategoryService } from '@ticket/app/_services/category.service';
import { EquipmentService } from '@ticket/app/_services/equipment.service';
import { ModalService } from 'shared';
import { ToastService } from 'shared';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonSelect,
  IonNote,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { trash, arrowBack } from 'ionicons/icons';
import { AlertService } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equipment-modal',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.scss'],
  imports: [
    IonNote,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCard,
    IonContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    IonSelectOption,
    IonInput,
    IonTextarea,
    IonSelect,
  ],
})
export class EquipmentModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  equipmentService = inject(EquipmentService);
  toastService = inject(ToastService);
  loadingService = inject(LoadingService);
  alertService = inject(AlertService);
  equipment?: EquipmentInterface;
  formEquipment!: FormGroup;
  categories$: Observable<CategoryInterface[]> =
    this.categoryService.categories;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;
  constructor() {
    addIcons({ trash, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
    this.getCategories();
    if (this.equipment) {
      this.formEquipment.patchValue(this.equipment);
    }
  }

  mountForm() {
    this.formEquipment = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      category_id: ['', [Validators.required]],
      obs: [''],
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  submit() {
    this.equipmentService.create(this.formEquipment.value).subscribe({
      next: () => {
        this.closeModal();
        this.toastService.presentToast(
          'Equipamento criado com sucesso!',
          'bottom',
          2000,
          'success',
        );
      },
      error: () => {
        this.toastService.presentToast(
          'Erro ao criar equipamento!',
          'bottom',
          2000,
          'danger',
        );
      },
    });
  }
}
