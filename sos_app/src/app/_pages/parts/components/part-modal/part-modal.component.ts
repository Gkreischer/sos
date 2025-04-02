import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { Part } from 'src/app/_models/Part';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { PartService } from 'src/app/_services/part.service';
import { ToastService } from 'src/app/_services/toast.service';
import {
  maskitoAddOnFocusPlugin,
  maskitoPrefixPostprocessorGenerator,
  maskitoRemoveOnBlurPlugin,
  maskitoNumberOptionsGenerator
} from '@maskito/kit';
import { PhotoService } from 'src/app/_services/photo.service';

@Component({
  selector: 'app-part-modal',
  templateUrl: './part-modal.component.html',
  styleUrls: ['./part-modal.component.scss'],
})
export class PartModalComponent  implements OnInit, AfterViewInit {

  partId!: number;
  part!: Observable<Part>;
  categories!: Observable<Category[]>;
  formPart!: FormGroup;

  currencyOptions: MaskitoOptions = maskitoNumberOptionsGenerator({
    prefix: 'R$ ',
    precision: 2,
    thousandSeparator: '',
  });

readonly maskPredicate: MaskitoElementPredicate = async (el) =>
  (el as HTMLIonInputElement).getInputElement();

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private partService: PartService,
    private toastService: ToastService,
    private photoService: PhotoService
  ) { }

  ngOnInit() {
    this.mountForm();
    this.getCategories();
    
  }

  ngAfterViewInit(): void {
    if(this.partId) {
      this.getPartData();
    }
  }

  getPartData() {
    this.partService.getPartById(this.partId).subscribe((part) => {
      this.part = this.partService.part;
      this.formPart.patchValue(part);
      console.log(part);
    })
  }

  submit() {
  }

  formatPrice() {
    const price = this.formPart.get('price')!.value;

    if(price) {
      const formattedValue = price.replace('R$', '').replace(',', '.');
      this.formPart.get('price')?.setValue(formattedValue);
      this.formPart.get('price')?.updateValueAndValidity();
    }
  }

  update() {
    const verifyImageWasChanged = this.verifyIfImageWasSelected();
    console.log(verifyImageWasChanged);
    if(verifyImageWasChanged) {
      this.uploadImage();
    }
    this.partService.update(this.formPart.value, this.partId).subscribe((part) => {
      console.log(part);
      this.toastService.presentToast('Parte atualizada com sucesso', 'bottom', 3000, 'success');
    });
  }

  async uploadImage() {
    const response = await this.photoService.startUpload();

    if(!response) {
      this.toastService.presentToast('Nenhum arquivo selecionado', 'bottom', 3000, 'danger');
      return;
    }
    this.formPart.get('image')?.setValue(response.imagePath);
    this.toastService.presentToast(response.message, 'bottom', 3000, 'success');
  }

  verifyIfImageWasSelected() {
    let imageBlob = this.formPart.get('image')?.value as string;
    if(imageBlob.startsWith('blob')) {
      return true;
    }
    return;
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(() => {
      this.categories = this.categoryService.categories;
    })
  }

  mountForm() {
    this.formPart = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: [''],
      image: [''],
      category_id: ['', [Validators.required]]
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  async selectImage() {
    const image = await this.photoService.selectImage();

    if(!image) {
      return;
    }

    this.formPart.get('image')?.setValue(image.webviewPath);
  }

}
