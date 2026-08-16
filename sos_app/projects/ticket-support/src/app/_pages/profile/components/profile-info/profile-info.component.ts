import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
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
import { filter, take, exhaustMap } from 'rxjs';
import { CepService } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  cepService = inject(CepService);

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
      if (res && res.cpf) {
        this.form.get('doc_type')?.setValue('1');
      } else {
        this.form.get('doc_type')?.setValue('2');
      }
      this.form.patchValue({
        ...res!,
        cpf: res?.cpf ? maskitoTransform(res.cpf, cpfMask) : null,
        cnpj: res?.cnpj ? maskitoTransform(res.cnpj, cnpjMask) : null,
        cep: res?.cep ? maskitoTransform(res.cep, cepMask) : null,
        phone: res?.phone ? maskitoTransform(res.phone, phoneMask) : null,
        state: res?.state ? res.state.toUpperCase() : null,
      });
    });
  }

  mountForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [[Validators.required, Validators.email]],
      address: [''],
      cep: [''],
      city: [''],
      cnpj: [],
      corporate_name: [''],
      country: [''],
      cpf: [],
      district: [''],
      fantasy_name: [''],
      image: [''],
      state: [''],
      phone: ['', [Validators.required]],
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
    this.user$
      .pipe(
        filter((user): user is UserInterface => !!user),
        take(1),
        exhaustMap((user) =>
          this.userService.updateUser({
            ...this.form.value,
            id: user.id,
          }),
        ),
      )
      .subscribe({
        next: () => {
          this.modalService.closeModal();

          this.toastService.presentToast(
            'Dados atualizados com sucesso',
            'bottom',
            4000,
            'success',
          );
        },
        error: (error) => {
          console.error(error);
        },
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

  verifyCep() {
    if (!this.form.get('cep')?.value) {
      return;
    }
    this.cepService.getCep(this.form.get('cep')?.value).subscribe((res) => {
      if (res) {
        this.form.patchValue({
          cep: res.cep,
          state: res.uf,
          city: res.localidade,
          address: res.logradouro,
          district: res.bairro,
        });
      }
    });
  }

  async takePicture() {
    const picture = await this.photoService.takePicture();

    if (!picture) {
      return;
    }

    const blob = await fetch(picture.webPath!).then((r) => r.blob());

    this.userService
      .updateAvatarImage({
        webPath: picture.webPath!,
        blob,
        format: picture.format,
      })
      .subscribe();
  }
}
