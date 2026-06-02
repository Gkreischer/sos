import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { inject } from '@angular/core';
import { LoginService } from 'src/app/_services/login.service';
import { ModalService } from 'src/app/_services/modal.service';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { UserLoginInterface } from 'src/app/_interfaces/UserLoginInterface';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { cnpjMask } from 'src/app/_masks/cnpjMask';
import { cepMask } from 'src/app/_masks/cepMask';
import { cpfMask } from 'src/app/_masks/cpfMask';
import { MaskitoElementPredicate } from '@maskito/core';
import { phoneMask } from 'src/app/_masks/phoneMask';
import { ToastService } from 'src/app/_services/toast.service';
import { PhotoService } from 'src/app/_services/photo.service';
import { IonicModule } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    JsonPipe,
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
  userForm!: FormGroup;

  cnpjMask = cnpjMask;
  cpfMask = cpfMask;
  cepMask = cepMask;
  phoneMask = phoneMask;

  user?: Observable<UserLoginInterface | null>;
  userId!: number;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

  ngOnInit() {
    this.mountForm();
    this.getLoggedUser();
  }

  getLoggedUser() {
    this.loginService.user.subscribe((user) => {
      this.user = this.loginService.user;
      if (user) {
        console.log(user);
        this.userId = user.id;
        this.userForm.patchValue(user);
      }
    });
  }

  mountForm() {
    this.userForm = this.formBuilder.group({
      name: [],
      email: [],
      cpf: [],
      fantasy_name: [],
      corporate_name: [],
      cnpj: [],
      cep: [],
      address: [],
      phone: [],
      city: [],
      state: [],
      country: [],
      image: [],
      password: [],
      confirmPassword: [],
    });
  }

  async updateUser() {
    const verifyImageWasChanged = this.verifyIfImageWasSelected();
    if (verifyImageWasChanged) {
      await this.uploadImage();
    }
    this.userService
      .updateUser(this.userForm.value, this.userId)
      .subscribe((user) => {
        console.log(user);

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

  async uploadImage() {
    const response = await this.photoService.startUpload();

    if (!response) {
      this.toastService.presentToast(
        'Nenhum arquivo selecionado',
        'bottom',
        3000,
        'danger',
      );
      return;
    }
    this.userForm.get('image')?.setValue(response.imagePath);
    this.toastService.presentToast(response.message, 'bottom', 3000, 'success');
  }

  verifyIfImageWasSelected() {
    let imageBlob = this.userForm.get('image')?.value as string;
    if (imageBlob.startsWith('blob')) {
      return true;
    }
    return;
  }

  async selectImage() {
    const image = await this.photoService.selectImage();

    if (!image) {
      return;
    }

    this.userForm.get('image')?.setValue(image.webviewPath);
  }
}
