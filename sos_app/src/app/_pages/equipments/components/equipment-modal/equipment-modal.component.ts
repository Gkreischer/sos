import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { Equipment } from 'src/app/_models/Equipment';
import { User } from 'src/app/_models/User';
import { CategoryService } from 'src/app/_services/category.service';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-equipment-modal',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.scss'],
})
export class EquipmentModalComponent implements OnInit {
  equipment?: Equipment;
  formEquipment!: FormGroup;
  categories!: Observable<Category[]>;
  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private equipmentService: EquipmentService,
    private toastService: ToastService,
    private userService: UserService
  ) {}

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
    console.log(this.formEquipment.value);
    this.equipmentService
      .updateEquipment(this.formEquipment.value, this.equipment!.id)
      .subscribe({
        next: () => {
          this.closeModal();
          this.toastService.presentToast(
            'Equipamento editado com sucesso!',
            'bottom',
            2000,
            'success'
          );
        },
        error: () => {
          this.toastService.presentToast(
            'Erro ao criar equipamento!',
            'bottom',
            2000,
            'danger'
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
          'success'
        );
      },
      error: () => {
        this.toastService.presentToast(
          'Erro ao criar equipamento!',
          'bottom',
          2000,
          'danger'
        );
      },
    });
  }

  get clientName() {
    return this.formEquipment.get('user_name')?.value;
  }

  searchClient() {
    let clientName = this.clientName;
    console.log(clientName);

    if (clientName.length == 0) {
      return;
    }
    this.userService.getUserByName(clientName).subscribe((user) => {
      console.log('recebido', user);

      if (!user) {
        this.toastService.presentToast(
          'Usuário não encontrado',
          'bottom',
          2000,
          'warning'
        );
        this.formEquipment.get('user_name')?.patchValue('');
        this.formEquipment.get('user_id')?.patchValue(null);
        return;
      }

      this.formEquipment.get('user_id')?.patchValue(user.id.toString());
    });
  }
}
