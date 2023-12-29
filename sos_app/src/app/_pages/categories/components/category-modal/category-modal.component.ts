import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/_models/Category';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent implements OnInit {
  categoryForm!: FormGroup;

  category!: Category;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.mountForm();
    if (this.category) {
      this.patchForm();
    }
  }

  patchForm() {
    this.categoryForm.addControl(
      'id',
      this.formBuilder.control(this.category.id)
    );
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
          'success'
        );
      },
      error: () => {
        this.toastService.presentToast(
          'Erro ao criar categoria!',
          'bottom',
          2000,
          'danger'
        );
      },
    });
  }

  update() {
    this.categoryService.updateCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.closeModal();
        this.toastService.presentToast(
          'Categoria criada com sucesso!',
          'bottom',
          2000,
          'success'
        );
      },
      error: () => {
        this.toastService.presentToast(
          'Erro ao criar categoria!',
          'bottom',
          2000,
          'danger'
        );
      },
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
