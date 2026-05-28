import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { UserTypeInterface } from 'src/app/_interfaces/UserTypeInterface';
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
import { UserTypeService } from 'src/app/_services/user-type.service';
import { IonicModule } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
  ],
})
export class UserModalComponent implements OnInit {
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private categoryService = inject(CategoryService);
  private userTypeService = inject(UserTypeService);

  user!: UserInterface;
  categories!: Observable<CategoryInterface[]>;
  userTypes!: Observable<UserTypeInterface[]>;

  userForm!: FormGroup;

  cnpjMask = cnpjMask;
  phoneMask = phoneMask;
  cepMask = cepMask;
  cpfMask = cpfMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

  ngOnInit() {
    this.mountForm();
    this.getUserTypes();
    if (this.user) {
      console.log(this.user);
      this.patchForm();
      this.getCategories();
    }
  }

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
      type_id: ['', [Validators.required]],
      district: [''],
      country: [''],
    });
  }

  patchForm() {
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

  deleteUser(user: UserInterface) {
    this.userService.deleteUser(user).subscribe({
      next: (user) => {
        this.closeModal();
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

  getUserTypes() {
    this.userTypeService.get().subscribe(() => {
      this.userTypes = this.userTypeService.userTypes;
    });
  }
}
