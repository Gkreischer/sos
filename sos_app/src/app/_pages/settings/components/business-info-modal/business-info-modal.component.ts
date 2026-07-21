import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaskitoElementPredicate } from '@maskito/core';
import { cepMask } from 'src/app/_masks/cepMask';
import { cnpjMask } from 'src/app/_masks/cnpjMask';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PhotoService } from 'src/app/_services/photo.service';
import { SettingService } from 'src/app/_services/setting.service';
import { ToastService } from 'src/app/_services/toast.service';
import { MaskitoDirective } from '@maskito/angular';
import { Observable } from 'rxjs';
import { LoadingService } from 'shared';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonInput,
} from '@ionic/angular/standalone';
import { phoneMask } from 'src/app/_masks/phoneMask';
import { maskitoTransform } from '@maskito/core';
import { addIcons } from 'ionicons';
import { camera, arrowBack } from 'ionicons/icons';
@Component({
  selector: 'app-business-info-modal',
  templateUrl: './business-info-modal.component.html',
  styleUrls: ['./business-info-modal.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonLabel,
    IonInput,
  ],
})
export class BusinessInfoModalComponent implements OnInit {
  modalService = inject(ModalService);
  settingService = inject(SettingService);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  photoService = inject(PhotoService);
  loadingService = inject(LoadingService);

  form!: FormGroup;
  businessAlreadyExists = false;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  cnpjMask = cnpjMask;
  cepMask = cepMask;
  phoneMask = phoneMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {
    addIcons({ camera, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
    this.getBusinessInfo();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  getBusinessInfo() {
    this.settingService.getBusinessInfo().subscribe((data) => {
      data.cnpj = maskitoTransform(data.cnpj, cnpjMask);
      data.phone = maskitoTransform(data.phone, phoneMask);
      this.form.patchValue(data);
      this.businessAlreadyExists = true;
    });
  }

  mountForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_number: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      image: ['', [Validators.required]],
      website: [''],
    });
  }

  submit() {
    const formatedPhone = this.form.get('phone')?.value;
    this.form.get('phone')?.setValue(formatedPhone.replace(/\D/g, ''));
    this.settingService
      .updateBusinessInfo(this.form.value)
      .subscribe((data) => {
        this.toastService.presentToast(
          'Dados atualizados com sucesso',
          'bottom',
          4000,
          'success',
        );
      });
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
    this.form.get('image')?.setValue(response.imagePath);
    this.toastService.presentToast(response.message, 'bottom', 3000, 'success');
  }

  verifyIfImageWasSelected() {
    let imageBlob = this.form.get('image')?.value as string;
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

    this.form.get('image')?.setValue(image.webviewPath);
  }

  async update() {
    const formatedPhone = this.form.get('phone')?.value;
    this.form.get('phone')?.setValue(formatedPhone.replace(/\D/g, ''));
    const verifyImageWasChanged = this.verifyIfImageWasSelected();
    if (verifyImageWasChanged) {
      await this.uploadImage();
    }
    this.settingService
      .updateBusinessInfo(this.form.value)
      .subscribe((businessInfo) => {
        this.toastService.presentToast(
          'Dados atualizados com sucesso',
          'bottom',
          4000,
          'success',
        );
      });
  }
}
