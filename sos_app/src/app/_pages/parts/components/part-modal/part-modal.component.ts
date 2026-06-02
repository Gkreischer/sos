import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
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
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { PartInterface } from 'src/app/_interfaces/PartInterface';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { ToastService } from 'src/app/_services/toast.service';
import { PhotoService } from 'src/app/_services/photo.service';
import { priceMask } from 'src/app/_masks/priceMask';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { JsonPipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'app-part-modal',
  templateUrl: './part-modal.component.html',
  styleUrls: ['./part-modal.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
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

  partId!: number;
  part$!: Observable<PartInterface>;
  categories!: Observable<CategoryInterface[]>;
  formPart!: FormGroup;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  partSubscription!: Subscription;

  priceMask: MaskitoOptions = priceMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

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

    this.formPart.get('image')?.setValue(image.webviewPath);
  }
}
