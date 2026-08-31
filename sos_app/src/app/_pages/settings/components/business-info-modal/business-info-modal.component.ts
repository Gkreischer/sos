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
import { MaskitoElementPredicate } from '@maskito/core';
import { cepMask } from 'projects/shared/src/lib/_masks/cepMask';
import { cnpjMask } from 'projects/shared/src/lib/_masks/cnpjMask';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PhotoService } from 'projects/shared/src/lib/_services/photo.service';
import { SettingService } from 'shared';
import { ToastService } from 'shared';
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
import { phoneMask } from 'projects/shared/src/lib/_masks/phoneMask';
import { maskitoTransform } from '@maskito/core';
import { addIcons } from 'ionicons';
import { camera, arrowBack } from 'ionicons/icons';
import { CepService } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  cepService = inject(CepService);

  form!: FormGroup;
  businessAlreadyExists = false;

  businessInfo$ = this.settingService.businessInfo$;

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
      data.cep = maskitoTransform(data.cep, cepMask);
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
      state: ['', [Validators.required, Validators.maxLength(2)]],
      country: ['', [Validators.required]],
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

  async takePicture() {
    const picture = await this.photoService.takePicture();

    if (!picture) {
      return;
    }

    this.settingService.changeBusinessLogo(picture).subscribe((res) => {
      this.form.get('image')?.setValue(res.image);
      this.toastService.presentToast(
        'Logo alterado com sucesso',
        'bottom',
        3000,
        'success',
      );
    });
  }

  async update() {
    const formatedPhone = this.form.get('phone')?.value;
    this.form.get('phone')?.setValue(formatedPhone.replace(/\D/g, ''));
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
        });
      }
    });
  }
}
