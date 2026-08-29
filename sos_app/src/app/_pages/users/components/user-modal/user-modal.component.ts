import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'shared';
import { UserInterface } from 'shared';
import { UserTypeInterface } from 'shared';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { ToastService } from 'shared';
import { UserService } from 'src/app/_services/user.service';
import { CepService } from 'projects/shared/src/lib/_services/cep.service';
import { cnpjMask } from 'projects/shared/src/lib/_masks/cnpjMask';
import { phoneMask } from 'projects/shared/src/lib/_masks/phoneMask';
import { cepMask } from 'projects/shared/src/lib/_masks/cepMask';
import { cpfMask } from 'projects/shared/src/lib/_masks/cpfMask';
import { UserTypeService } from 'src/app/_services/user-type.service';
import { MaskitoDirective } from '@maskito/angular';
import { addIcons } from 'ionicons';
import { arrowBack, trash } from 'ionicons/icons';
import { LoadingService } from 'shared';
import { UserPasswordModalComponent } from './../user-password-modal/user-password-modal.component';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSelectOption,
  IonButton,
  IonFab,
  IonFabButton,
  IonSelect,
  IonInput,
} from '@ionic/angular/standalone';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  imports: [
    IonFabButton,
    IonFab,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCard,
    IonContent,
    IonIcon,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    IonSelectOption,
    IonSelect,
    IonInput,
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
  private loadingService = inject(LoadingService);

  user!: UserInterface;
  categories!: Observable<CategoryInterface[]>;
  userTypes!: Observable<UserTypeInterface[]>;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  enablePasswordsInput: boolean = false;

  userForm!: FormGroup;

  cnpjMask = cnpjMask;
  phoneMask = phoneMask;
  cepMask = cepMask;
  cpfMask = cpfMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {
    addIcons({ trash, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
    this.getUserTypes();
    if (this.user) {
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
      cep: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      city: [''],
      state: ['', [Validators.minLength(2), Validators.maxLength(2)]],
      type_id: ['', [Validators.required]],
      district: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });

    this.enableInputPasswordsByUserType();
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

  verifyCep() {
    if (!this.userForm.get('cep')?.value) {
      return;
    }
    this.cepService.getCep(this.userForm.get('cep')?.value).subscribe((res) => {
      if (!res) {
        return;
      }
      if (res.erro === 'true') {
        return;
      }
      this.userForm.patchValue({
        state: res.uf,
        city: res.localidade,
        address: res.logradouro,
        district: res.bairro,
      });
    });
  }

  enableInputPasswordsByUserType() {
    this.userForm.get('type_id')?.valueChanges.subscribe((typeId) => {
      this.enablePasswordsInput = [1, 3, 4, 5].includes(typeId);
    });
  }

  openModalChangePassword() {
    this.modalService.openModal(UserPasswordModalComponent, {
      userId: this.user.id,
    });
  }
}
