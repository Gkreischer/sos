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
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { CategoryService } from 'src/app/_services/category.service';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';
import { AsyncPipe } from '@angular/common';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
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
  IonFab,
  IonFabButton,
  IonInput,
  IonTextarea,
  IonSelect,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { trash, arrowBack } from 'ionicons/icons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equipment-modal',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.scss'],
  imports: [
    IonFabButton,
    IonFab,
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
  categories: Observable<CategoryInterface[]> = this.categoryService.categories;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;
  constructor() {
    addIcons({ trash, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
    if (this.equipment) {
      this.formEquipment.get('user_name')?.patchValue(this.equipment.user.name);
      this.formEquipment.patchValue(this.equipment);
      this.formEquipment.get('user_name')?.disable();
    }
    this.getCategories();
  }

  mountForm() {
    this.formEquipment = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      category_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      user_name: ['', [Validators.required]],
      obs: [''],
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  update() {
    this.equipmentService
      .updateEquipment(this.formEquipment.value, this.equipment!.id)
      .subscribe({
        next: () => {
          this.closeModal();
          this.toastService.presentToast(
            'Equipamento editado com sucesso!',
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

  submit() {
    this.equipmentService.addEquipment(this.formEquipment.value).subscribe({
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

  get clientName() {
    return this.formEquipment.get('user_name')?.value;
  }

  async searchClient() {
    let modalSelectUser = await this.modalService.openModal(
      UsersListComponent,
      {
        returnClientIdMode: true,
      },
    );

    if (!modalSelectUser) {
      return;
    }

    this.formEquipment
      .get('user_id')
      ?.patchValue(modalSelectUser.id.toString());
    this.formEquipment.get('user_name')?.patchValue(modalSelectUser.name);
  }

  confirmDelete() {
    this.alertService.presentAlert(
      'Atenção',
      '',
      'Tem certeza que deseja excluir este equipamento?',
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          id: 'confirm-button',
          handler: () => {
            this.equipmentService.delete(this.equipment!.id).subscribe({
              next: () => {
                this.closeModal();
                this.toastService.presentToast(
                  'Equipamento excluído com sucesso!',
                  'bottom',
                  2000,
                  'success',
                );
              },
            });
          },
        },
      ],
    );
  }
}
