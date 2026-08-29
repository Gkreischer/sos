import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MaskitoElementPredicate,
  MaskitoOptions,
  maskitoTransform,
} from '@maskito/core';
import { Observable, Subscription } from 'rxjs';
import { CategoryInterface } from 'shared';
import { PartInterface } from 'shared';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { ToastService } from 'shared';
import { PhotoService } from 'projects/shared/src/lib/_services/photo.service';
import { priceMask } from 'projects/shared/src/lib/_masks/priceMask';
import { AsyncPipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { LoadingService } from 'shared';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonInput,
  IonTextarea,
  IonSelect,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { camera, arrowBack, trash } from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-part-modal',
  templateUrl: './part-modal.component.html',
  styleUrls: ['./part-modal.component.scss'],
  imports: [
    IonFabButton,
    IonFab,
    IonLabel,
    IonImg,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCard,
    IonContent,
    IonInput,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonSelectOption,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    IonTextarea,
    IonSelect,
    IonSelectOption,
  ],
})
export class PartModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  categoryService = inject(CategoryService);
  partService = inject(PartService);
  toastService = inject(ToastService);
  photoService = inject(PhotoService);
  loadingService = inject(LoadingService);
  alertService = inject(AlertService);

  partId!: number;
  part$!: Observable<PartInterface>;
  categories!: Observable<CategoryInterface[]>;
  formPart!: FormGroup;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  partSubscription!: Subscription;

  // Signal for picture preview reactivity
  private imageSignal = signal<string | null>(null);
  imagePreview = computed(
    () => this.imageSignal() || this.formPart?.get('image')?.value || null,
  );

  priceMask: MaskitoOptions = priceMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {
    addIcons({ camera, arrowBack, trash });
  }

  ngOnInit() {
    this.mountForm();
    this.getCategories();
    if (this.partId) {
      this.getPartData();
    }
  }

  getPartData() {
    this.partService.getPartById(this.partId).subscribe((part) => {
      this.formPart.patchValue({
        ...part,
        price: maskitoTransform(part.price.toString(), priceMask),
      });
      // Use image from part, or fallback to service's cached parts
      const image = part.image || this.partService.getCachedImage(this.partId);
      if (image) {
        this.imageSignal.set(image);
      }
    });
  }

  async submit() {
    const verifyImageWasChanged = this.verifyIfImageWasSelected();
    if (verifyImageWasChanged) {
      await this.uploadImage();
    }
    this.partService.create(this.formPart.value).subscribe((part) => {
      this.closeModal();
      this.toastService.presentToast(
        'Parte criada com sucesso!',
        'bottom',
        2000,
        'success',
      );
    });
  }

  async update() {
    const verifyImageWasChanged = this.verifyIfImageWasSelected();
    if (verifyImageWasChanged) {
      await this.uploadImage();
    }
    let part: PartInterface = this.formPart.value;
    this.partService.update(part, this.partId).subscribe((part) => {
      this.toastService.presentToast(
        'Parte atualizada com sucesso',
        'bottom',
        3000,
        'success',
      );
      this.modalService.closeModal();
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(() => {
      this.categories = this.categoryService.categories;
    });
  }

  mountForm() {
    this.formPart = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: [''],
      image: [''],
      category_id: ['', [Validators.required]],
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
    this.formPart.get('image')?.setValue(response.imagePath);
    this.imageSignal.set(response.imagePath);
    this.toastService.presentToast(response.message, 'bottom', 3000, 'success');
  }

  verifyIfImageWasSelected() {
    let imageBlob = this.formPart.get('image')?.value as string;
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

    const webviewPath = image.webviewPath || '';
    this.formPart.get('image')?.setValue(webviewPath);
    this.imageSignal.set(webviewPath);
  }

  async confirmDelete() {
    this.alertService.presentAlert(
      'Atenção',
      '',
      'Tem certeza que deseja excluir esta parte?',
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
            this.partService.delete(this.partId).subscribe({
              next: () => {
                this.closeModal();
                this.toastService.presentToast(
                  'Parte excluído com sucesso!',
                  'bottom',
                  2000,
                  'success',
                );
              },
            });
          },
        },
      ],
    );
  }
}
