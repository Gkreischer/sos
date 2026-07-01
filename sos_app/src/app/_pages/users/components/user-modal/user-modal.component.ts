import { AsyncPipe } from '@angular/common';
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
import { CepService } from 'src/app/_services/cep.service';
import { cnpjMask } from 'src/app/_masks/cnpjMask';
import { phoneMask } from 'src/app/_masks/phoneMask';
import { cepMask } from 'src/app/_masks/cepMask';
import { cpfMask } from 'src/app/_masks/cpfMask';
import { UserTypeService } from 'src/app/_services/user-type.service';
import { IonicModule } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

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
  private cepService = inject(CepService);

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

  constructor() {
    addIcons({ trash });
  }

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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      cpf: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      corporate_name: [''],
      fantasy_name: [''],
      cnpj: ['', [Validators.minLength(18), Validators.maxLength(18)]],
      cep: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      city: [''],
      state: ['', [Validators.minLength(2), Validators.maxLength(2)]],
      type_id: ['', [Validators.required]],
      district: [''],
      country: [''],
    });
  }

  patchForm() {
    const formattedUser = {
      ...this.user,
      cpf: this.user.cpf ? maskitoTransform(this.user.cpf, cpfMask) : null,
      cnpj: this.user.cnpj ? maskitoTransform(this.user.cnpj, cnpjMask) : null,
      cep: this.user.cep ? maskitoTransform(this.user.cep, cepMask) : null,
      phone: this.user.phone
        ? maskitoTransform(this.user.phone, phoneMask)
        : null,
    };

    this.userForm.patchValue(formattedUser);
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

  cepChanged(event: CustomEvent) {
    const cep = event.detail.value;
    this.cepService.getCep(cep).subscribe((res) => {
      console.log(res);
      this.userForm.patchValue({
        ...this.userForm.value,
        district: res.bairro,
        city: res.localidade,
        state: res.uf,
        address: res.logradouro,
      });
    });
  }
}
