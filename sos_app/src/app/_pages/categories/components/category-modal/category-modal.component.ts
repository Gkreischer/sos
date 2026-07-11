import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { AlertService } from 'src/app/_services/alert.service';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
import { Observable } from 'rxjs';
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
  IonFab,
  IonFabButton,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, trash } from 'ionicons/icons';
@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
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
    IonInput,
  ],
})
export class CategoryModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  toastService = inject(ToastService);
  alertService = inject(AlertService);
  loadingService = inject(LoadingService);

  categoryForm!: FormGroup;

  category!: CategoryInterface;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  constructor() {
    addIcons({ arrowBack, trash });
  }

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
    this.categoryService.addCategory(this.categoryForm.value).subscribe(() => {
      this.closeModal();
      this.toastService.presentToast(
        'Categoria criada com sucesso!',
        'bottom',
        2000,
        'success',
      );
    });
  }

  update() {
    this.categoryService
      .updateCategory(this.categoryForm.value, this.category.id)
      .subscribe(() => {
        this.closeModal();
        this.toastService.presentToast(
          'Categoria atualizada com sucesso!',
          'bottom',
          2000,
          'success',
        );
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
          id: 'confirm-button',
          handler: () => {
            this.deleteCategory(this.category);
          },
        },
      ],
    );
  }

  deleteCategory(category: CategoryInterface) {
    this.categoryService.deleteCategory(category).subscribe(() => {
      this.closeModal();
      this.toastService.presentToast(
        'Categoria deletada com sucesso!',
        'bottom',
        2000,
        'success',
      );
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
