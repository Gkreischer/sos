import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { EquipmentInterface } from 'src/app/_interfaces/EquipmentInterface';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { CategoryService } from 'src/app/_services/category.service';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';

@Component({
  selector: 'app-equipment-modal',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.scss'],
  standalone: false,
})
export class EquipmentModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  equipmentService = inject(EquipmentService);
  toastService = inject(ToastService);

  equipment?: EquipmentInterface;
  formEquipment!: FormGroup;
  categories!: Observable<CategoryInterface[]>;
  constructor() {}

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
      description: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      user_name: ['', [Validators.required]],
      obs: [''],
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = this.categoryService.categories;
    });
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
}
