import {Component, OnInit, ChangeDetectionStrategy, signal, computed} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { inject } from '@angular/core';
import { LoginService } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { UserLoginInterface } from 'shared';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { cnpjMask } from 'projects/shared/src/lib/_masks/cnpjMask';
import { cepMask } from 'projects/shared/src/lib/_masks/cepMask';
import { cpfMask } from 'projects/shared/src/lib/_masks/cpfMask';
import { MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { phoneMask } from 'projects/shared/src/lib/_masks/phoneMask';
import { ToastService } from 'src/app/_services/toast.service';
import { PhotoService } from 'projects/shared/src/lib/_services/photo.service';
import { MaskitoDirective } from '@maskito/angular';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from 'shared';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonContent,
  IonCardContent,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonGrid,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, arrowBack } from 'ionicons/icons';
import { CepService } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss'],
  imports: [
    IonGrid,
    IonLabel,
    IonImg,
    IonCol,
    IonRow,
    IonCardContent,
    IonContent,
    IonCard,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    IonInput,
  ],
})
export class UserInfoModalComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  modalService = inject(ModalService);
  userService = inject(UserService);
  toastService = inject(ToastService);
  photoService = inject(PhotoService);
  loadingService = inject(LoadingService);
  cepService = inject(CepService);
  userForm!: FormGroup;

  cnpjMask = cnpjMask;
  cpfMask = cpfMask;
  cepMask = cepMask;
  phoneMask = phoneMask;

  user?: Observable<UserLoginInterface | null>;
  userId!: number;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  // Signal for avatar preview reactivity
  private avatarSignal = signal<string | null>(null);
  avatarPreview = computed(() => this.avatarSignal() || this.userForm?.get('image')?.value || null);

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {
    addIcons({ camera, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
    this.getLoggedUser();
  }

  getLoggedUser() {
    this.loginService.user.subscribe((user) => {
      this.user = this.loginService.user;
      if (user) {
        this.userId = user.id;
        user.cpf = maskitoTransform(user.cpf, cpfMask);
        user.phone = maskitoTransform(user.phone, phoneMask);
        user.cep = maskitoTransform(user.cep, cepMask);
        this.userForm.patchValue(user);
        if (user.image) {
          this.avatarSignal.set(user.image);
        }
      }
    });
  }

  mountForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      fantasy_name: [],
      corporate_name: [],
      cep: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      country: ['', [Validators.required]],
      image: [],
      password: [],
      confirmPassword: [],
    });
  }

  async updateUser() {
    this.userService
      .updateUser(this.userForm.value, this.userId)
      .subscribe((user) => {
        this.toastService.presentToast(
          'Usuário atualizado com sucesso',
          'bottom',
          3000,
          'success',
        );
        // this.modalService.closeModal();
      });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  verifyCep() {
    if (!this.userForm.get('cep')?.value) {
      return;
    }
    this.cepService.getCep(this.userForm.get('cep')?.value).subscribe((res) => {
      if (res) {
        this.userForm.patchValue({
          cep: res.cep,
          state: res.uf,
          city: res.localidade,
          address: res.logradouro,
        });
      }
    });
  }

  async takePicture() {
    const picture = await this.photoService.takePicture();

    if (!picture) {
      return;
    }

    const webPath = picture.webPath || '';
    this.userForm.get('image')?.setValue(webPath);
    this.avatarSignal.set(webPath);

    this.userService.updateAvatarImage(picture).subscribe();
  }
}
