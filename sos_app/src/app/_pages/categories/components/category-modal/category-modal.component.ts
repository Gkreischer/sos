import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { AlertService } from 'src/app/_services/alert.service';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: false,
})
export class CategoryModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  toastService = inject(ToastService);
  alertService = inject(AlertService);

  categoryForm!: FormGroup;

  category!: CategoryInterface;

  constructor() {}

  ngOnInit() {
    this.mountForm();
    if (this.category) {
      this.patchForm();
    }
  }

  patchForm() {
    this.categoryForm.patchValue(this.category);
  }

  mountForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  submit() {
    this.categoryService.addCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.closeModal();
        this.toastService.presentToast(
          'Categoria criada com sucesso!',
          'bottom',
          2000,
          'success',
        );
      },
      error: () => {
        this.toastService.presentToast(
          'Erro ao criar categoria!',
          'bottom',
          2000,
          'danger',
        );
      },
    });
  }

  update() {
    this.categoryService
      .updateCategory(this.categoryForm.value, this.category.id)
      .subscribe({
        next: () => {
          this.closeModal();
          this.toastService.presentToast(
            'Categoria criada com sucesso!',
            'bottom',
            2000,
            'success',
          );
        },
        error: () => {
          this.toastService.presentToast(
            'Erro ao criar categoria!',
            'bottom',
            2000,
            'danger',
          );
        },
      });
  }

  async confirmDeleteCategory() {
    await this.alertService.presentAlert(
      'Atenção',
      '',
      'Tem certeza que deseja excluir esta categoria?',
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.deleteCategory(this.category);
          },
        },
      ],
    );
  }

  deleteCategory(category: CategoryInterface) {
    this.categoryService.deleteCategory(category).subscribe({
      next: () => {
        this.closeModal();
        this.toastService.presentToast(
          'Categoria deletada com sucesso!',
          'bottom',
          2000,
          'success',
        );
      },
      error: (err) => {
        this.toastService.presentToast(err, 'bottom', 2000, 'danger');
      },
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
