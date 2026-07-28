import { Component, inject, OnInit } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCol,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonModal,
  IonNote,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from 'shared';
import { LoadingService } from 'shared';
import { cepMask } from 'shared';
import { cnpjMask } from 'shared';
import { phoneMask } from 'shared';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoTransform, MaskitoElementPredicate } from '@maskito/core';
import { cpfMask } from 'shared';
import { addIcons } from 'ionicons';
import { checkmarkCircle, key } from 'ionicons/icons';
import { AsyncPipe } from '@angular/common';
import { ModalService } from 'shared';
import { ToastService } from 'shared';
import { UserService } from '@ticket/app/_services/user.service';
import { UserInterface } from 'shared';
import { IonInputPasswordToggle } from '@ionic/angular/standalone';
import { PhotoService } from 'shared';
@Component({
  selector: 'app-profile-info',
  imports: [
    IonNote,
    IonModal,
    IonLabel,
    IonIcon,
    IonButton,
    IonImg,
    IonInput,
    IonCol,
    IonCardContent,
    IonCard,
    IonRow,
    IonGrid,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    MaskitoDirective,
    AsyncPipe,
    IonInputPasswordToggle,
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  loadingService = inject(LoadingService);
  toastService = inject(ToastService);
  modalService = inject(ModalService);
  userService = inject(UserService);
  photoService = inject(PhotoService);

  form!: FormGroup;
  formPassword!: FormGroup;

  user$ = this.loginService.user;
  loading$ = this.loadingService.isLoading$;

  user!: UserInterface;

  cpfMask = cpfMask;
  cepMask = cepMask;
  cnpjMask = cnpjMask;
  phoneMask = phoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {
    addIcons({ checkmarkCircle, key });
  }

  ngOnInit() {
    this.mountForm();
    this.getUser();
  }

  getUser() {
    this.loginService.user.subscribe((res) => {
      this.user = res!;
      this.form.patchValue({
        ...res!,
        cpf: maskitoTransform(res!.cpf, cpfMask),
        cnpj: maskitoTransform(res!.cnpj, cnpjMask),
        cep: maskitoTransform(res!.cep, cepMask),
        phone: maskitoTransform(res!.phone, phoneMask),
      });
    });
  }

  mountForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      address: [''],
      cep: [''],
      city: [''],
      cnpj: [{ value: '', disabled: true }],
      corporate_name: [''],
      country: [''],
      cpf: [{ value: '', disabled: true }],
      district: [''],
      fantasy_name: [''],
      image: [''],
      state: [''],
      phone: [''],
      doc_type: ['1', [Validators.required]],
    });

    this.formPassword = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
        ],
      ],
      password_confirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
        ],
      ],
    });

    this.formPassword
      .get('password_confirmation')
      ?.valueChanges.subscribe((keyword) => {
        this.formPassword.get('password')?.value !== keyword
          ? this.formPassword.get('password_confirmation')?.setErrors({
              mismatch: true,
              emitEvent: false,
            })
          : this.formPassword.get('password_confirmation')?.setErrors(null);
      });
  }

  submit() {
    this.userService
      .updateUser(this.form.value)
      .subscribe((res: UserInterface) => {
        this.modalService.closeModal();
        this.toastService.presentToast(
          'Dados atualizados com sucesso',
          'bottom',
          4000,
          'success',
        );
      });
  }

  changeUserPassword() {
    this.loginService.updateUserPassword(this.formPassword.value).subscribe({
      next: () => {
        this.modalService.closeModal();
        this.toastService.presentToast(
          'Senha atualizada com sucesso',
          'bottom',
          5000,
          'success',
        );
      },
    });
  }

  async changeUserImage() {
    const result = await this.photoService.takePicture();
    if (!result) {
      return;
    }
  }
}
