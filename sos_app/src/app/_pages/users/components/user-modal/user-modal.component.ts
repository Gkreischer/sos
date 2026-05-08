import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MaskitoElementPredicate,
  MaskitoOptions,
  maskitoTransform,
} from '@maskito/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { User } from 'src/app/_models/User';
import { UserType } from 'src/app/_models/UserType';
import { AlertService } from 'src/app/_services/alert.service';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';
import { IonHeader } from '@ionic/angular/standalone';
import { cnpjMask } from 'src/app/_masks/cnpjMask';
import { phoneMask } from 'src/app/_masks/phoneMask';
import { cepMask } from 'src/app/_masks/cepMask';
import { cpfMask } from 'src/app/_masks/cpfMask';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  user!: User;
  categories!: Observable<Category[]>;

  userForm!: FormGroup;

  cnpjMask = cnpjMask;
  phoneMask = phoneMask;
  cepMask = cepMask;
  cpfMask = cpfMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private alertService: AlertService,
    private categoryService: CategoryService,
  ) {}

  mountForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: [''],
      cpf: [''],
      corporate_name: [''],
      fantasy_name: [''],
      cnpj: [''],
      cep: [''],
      city: [''],
      state: [''],
      type: ['', [Validators.required]],
      country: [''],
    });
  }

  ngOnInit() {
    this.mountForm();
    if (this.user) {
      this.patchForm();
      this.getCategories();
    }
  }

  patchForm() {
    const user = this.user;
    this.user.cpf = maskitoTransform(this.user.cpf, cpfMask);
    this.user.cnpj = maskitoTransform(this.user.cnpj, cnpjMask);
    this.user.cep = maskitoTransform(this.user.cep, cepMask);
    this.userForm.patchValue(this.user);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  submit() {
    this.userService.addUser(this.userForm.value).subscribe((user) => {
      this.closeModal();
      this.toastService.presentToast(
        'Usuário criado com sucesso!',
        'bottom',
        2000,
        'success',
      );
    });
  }

  update() {
    this.userService.updateUser(this.userForm.value, this.user.id).subscribe({
      next: () => {
        this.closeModal();
        this.toastService.presentToast(
          'Usuário criado com sucesso!',
          'bottom',
          2000,
          'success',
        );
      },
      error: () => {
        this.toastService.presentToast(
          'Erro ao criar o usuário!',
          'bottom',
          2000,
          'danger',
        );
      },
    });
  }

  async confirmDeleteUser() {
    console.log('deletando');
    await this.alertService.presentAlert(
      'Atenção',
      '',
      'Tem certeza que deseja excluir este usuário?',
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
            this.deleteUser(this.user);
          },
        },
      ],
    );
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe({
      next: (user) => {
        this.closeModal();
        console.log(user);
        this.toastService.presentToast(
          'Usuário deletado com sucesso!',
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

  getCategories() {
    this.categoryService.getCategories().subscribe(() => {
      this.categories = this.categoryService.categories;
    });
  }
}
