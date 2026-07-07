import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoryInterface } from 'src/app/_interfaces/CategoryInterface';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { ModalService } from 'src/app/_services/modal.service';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { EquipmentInterface } from 'src/app/_interfaces/EquipmentInterface';
import { OrderService } from 'src/app/_services/order.service';
import { OrderInterface } from 'src/app/_interfaces/OrderInterface';
import { AlertService } from 'src/app/_services/alert.service';
import { ModalAddPartComponent } from '../modal-add-part/modal-add-part.component';
import { PartInterface } from 'src/app/_interfaces/PartInterface';
import { ToastService } from 'src/app/_services/toast.service';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderStatusInterface } from 'src/app/_interfaces/OrderStatusInterface';
import { MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { priceMask } from 'src/app/_masks/priceMask';
import { MoneyService } from 'src/app/_shared/utils/services/money.service';
import { Router } from '@angular/router';
import { dateMask } from 'src/app/_masks/dateMask';

import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { OrderClientHistoryComponent } from '../order-client-history/order-client-history.component';
import {
  SignaturePadComponent,
  NgSignaturePadOptions,
} from '@almothafar/angular-signature-pad';
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
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
  imports: [
    IonCardTitle,
    IonCardHeader,
    FormsModule,
    ReactiveFormsModule,
    MaskitoDirective,
    AsyncPipe,
    CurrencyPipe,
    SignaturePadComponent,
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
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonCardHeader,
    IonCardTitle,
    IonSelectOption,
    IonInput,
    IonSelect,
    IonTextarea,
  ],
})
export class OrderModalComponent implements OnInit, AfterViewInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  equipmentService = inject(EquipmentService);
  orderService = inject(OrderService);
  alertService = inject(AlertService);
  toastService = inject(ToastService);
  orderStatusService = inject(OrderStatusService);
  router = inject(Router);
  moneyService = inject(MoneyService);
  loadingService = inject(LoadingService);
  signaturePad = viewChild(SignaturePadComponent);

  orderId?: number;
  orderReceived!: OrderInterface;
  orderForm!: FormGroup;
  categories$?: Observable<CategoryInterface[]>;
  equipments$?: Observable<EquipmentInterface[]>;
  clientSelected?: UserInterface;
  technicianSelected?: UserInterface;
  orderStatuses$: Observable<OrderStatusInterface[]> =
    this.orderStatusService.order_statuses;
  selectOrderStatusDisabled = false;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  priceMask = priceMask;
  dateMask = dateMask;

  public signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300,
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {}

  ngOnInit() {
    this.getOrderDetailsById();
    this.mountForm();
    this.patchFormTotalPrice();
    this.getOrderStatuses();
  }

  get parts() {
    return this.orderForm.get('parts') as FormArray;
  }

  get totalPartsPrice() {
    return this.parts.controls.reduce((total, part) => {
      const quantity = this.moneyService.parse(part.get('quantity')?.value);
      const price = this.moneyService.parse(part.get('price')?.value);

      return total + quantity * price;
    }, 0);
  }

  get servicePrice() {
    return this.moneyService.parse(this.orderForm.get('service_price')?.value);
  }

  get discount(): number {
    return this.moneyService.parse(this.orderForm.get('discount')?.value);
  }

  get totalPrice() {
    return this.totalPartsPrice + this.servicePrice - this.discount;
  }

  ngAfterViewInit() {
    this.signaturePad()!.set('minWidth', 5);
    this.signaturePad()!.changeBackgroundColor('#61C2FF');
    this.signaturePad()!.clear();
  }

  drawComplete(event: MouseEvent | Touch) {
    this.orderForm.get('signature')?.setValue(this.signaturePad()?.toDataURL());
  }

  drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
  }

  drawCleared() {
    // will be notified when clear() is called on the pad
  }

  clearSignature() {
    if (this.signaturePad()?.isEmpty) {
      this.orderForm.get('signature')?.setValue('');
      this.signaturePad()?.clear();
    }
  }

  mountForm() {
    this.orderForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      equipment_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      technician_id: [''],
      status_id: [this.orderId ? this.orderId : 1, [Validators.required]],
      service_description: [''],
      diagnostic: [''],
      signature: ['', [Validators.required]],
      parts: this.formBuilder.array([]),
      obs: [''],
      service_price: [0],
      parts_price: [0],
      total_price: [0],
      discount: [0],
    });
  }

  disabledSelectForDeliveredStatus() {
    const orderStatus = this.orderForm.get('status_id')?.value;
    const blockIds = [4, 5];
    if (blockIds.includes(orderStatus)) {
      this.selectOrderStatusDisabled = true;
      this.orderForm.get('status_id')?.disable();
    }
  }

  patchFormTotalPrice() {
    this.orderForm &&
      this.orderForm.patchValue({
        parts_price: this.totalPartsPrice,
        total_price: this.totalPrice.toFixed(2),
      });
  }

  addParts(parts: PartInterface[]) {
    if (parts.length === 0) {
      return;
    }

    parts.forEach((part) => {
      this.parts.push(
        this.formBuilder.group({
          id: [part.id, [Validators.required]],
          name: [part.name, [Validators.required]],
          quantity: [part.quantity, [Validators.required]],
          price: [part.price, [Validators.required]],
        }),
      );
    });
  }

  addPart(part: PartInterface) {
    this.parts.push(
      this.formBuilder.group({
        part_id: [part.id, [Validators.required]],
        name: [part.name, [Validators.required]],
        quantity: [1, [Validators.required]],
        price: [part.price, [Validators.required]],
      }),
    );
  }

  removePart(index: number) {
    this.parts.removeAt(index);
  }

  getUserEquipments() {
    this.equipmentService
      .getUserEquipments(this.clientSelected!)
      .subscribe((equipaments) => {
        this.equipments$ = this.equipmentService.equipments;
      });
  }

  getOrderDetailsById() {
    if (!this.orderId) {
      return;
    }

    this.orderService.getById(this.orderId).subscribe((order) => {
      this.orderReceived = order;

      this.orderForm.patchValue({
        ...order,
        service_price: maskitoTransform(
          order.service_price.toString(),
          priceMask,
        ),
        discount: maskitoTransform(order.discount.toString(), priceMask),
        signature: this.signaturePad()?.fromDataURL(order.signature),
      });
      this.clientSelected = order.user;
      this.technicianSelected = order.technician;
      this.addParts(order.order_parts);
      this.getUserEquipments();
      this.disabledSelectForDeliveredStatus();
      this.patchFormTotalPrice();
      this.signaturePad()?.off();
    });
  }

  async selectClientId() {
    let client = await this.modalService.openModal(UsersListComponent, {
      returnClientIdMode: true,
    });

    if (!client) {
      return;
    }

    this.orderForm.get('user_id')?.setValue(client.id);
    this.clientSelected = client;
    this.getUserEquipments();
  }

  async selectTechnicianId() {
    let technician = await this.modalService.openModal(UsersListComponent, {
      returnClientIdMode: true,
    });

    if (technician) {
      this.technicianSelected = technician;
      this.orderForm.get('technician_id')?.setValue(technician.id);
    }
  }

  submit() {
    this.orderService.create(this.orderForm.value).subscribe((order) => {
      this.toastService.presentToast(
        'Ordem criada com sucesso',
        'bottom',
        4000,
        'success',
      );
      this.closeModal();
    });
  }

  update() {
    this.orderService
      .update(+this.orderReceived.id, this.orderForm.value)
      .subscribe((order) => {
        this.showUpdateSuccessToast();
        this.patchFormTotalPrice();
      });
  }

  showUpdateSuccessToast() {
    this.toastService.presentToast(
      'Ordem de serviço atualizada com sucesso!',
      'bottom',
      4000,
      'success',
    );
  }
  closeModal() {
    this.modalService.closeModal();
  }

  showAlertCancelOrder() {
    this.alertService.presentAlert(
      'Atenção',
      'Essa operação não poderá ser desfeita',
      'Você deseja encerrar a ordem de serviço?',
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
            this.closeModal();
          },
        },
      ],
    );
  }

  async openModalAddPart() {
    const modalData = await this.modalService.openModal(ModalAddPartComponent, {
      orderId: this.orderId,
    });
    if (!modalData) {
      return;
    }
    this.addPart(modalData);
  }

  getOrderStatuses() {
    this.orderStatusService.getOrderStatuses().subscribe();
  }

  onChangeStatus() {
    let orderStatus = this.orderForm.get('status_id')?.value;

    if (!orderStatus) {
      return;
    }

    orderStatus == 4 ? this.confirmOrderFinalization() : false;
  }

  confirmOrderFinalization() {
    this.alertService.presentAlert(
      'Atenção',
      '',
      'Você deseja entregar a OS? Não será possível reveter.',
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {},
        },
      ],
    );
  }

  showClientHistory() {
    this.modalService.openModal(OrderClientHistoryComponent, {
      clientId: this.clientSelected?.id,
    });
  }

  print() {
    this.closeModal();
    this.router.navigate(['/imprimir', this.orderId]);
  }
}
