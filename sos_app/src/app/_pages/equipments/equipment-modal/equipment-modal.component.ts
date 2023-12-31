import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { Equipment } from 'src/app/_models/Equipment';
import { CategoryService } from 'src/app/_services/category.service';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';

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
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.mountForm();
    if (this.equipment) {
      this.formEquipment.get('user_name')?.patchValue(this.equipment.user.name);
      this.formEquipment.patchValue(this.equipment);
      this.formEquipment.get('user_name')?.disable();
      console.log(this.equipment);
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
}
