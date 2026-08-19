import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  viewChild,
  ChangeDetectionStrategy,
  computed,
  linkedSignal,
  signal,
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
import { CategoryInterface } from 'shared';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { UserInterface } from 'shared';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { EquipmentInterface } from 'shared';
import { OrderService } from 'src/app/_services/order.service';
import { OrderInterface } from 'shared';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { ModalAddPartComponent } from '../modal-add-part/modal-add-part.component';
import { PartInterface } from 'shared';
import { ToastService } from 'src/app/_services/toast.service';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderStatusInterface } from 'shared';
import { MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { priceMask } from 'projects/shared/src/lib/_masks/priceMask';
import { MoneyService } from 'src/app/_shared/utils/services/money.service';
import { Router } from '@angular/router';
import { dateMask } from 'projects/shared/src/lib/_masks/dateMask';
import { ModalImageComponent } from 'shared';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { LoadingService } from 'shared';
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
  IonImg,
  IonFooter,
  IonText,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkDoneSharp,
  printSharp,
  trash,
  arrowBack,
  close,
  searchSharp,
  add,
  search,
} from 'ionicons/icons';
import { PhotoService } from 'projects/shared/src/lib/_services/photo.service';
import { PictureInterface } from 'shared';
import { OrderStatusEnum } from 'shared';
import { EquipmentOrderHistoryModalComponent } from '../equipment-order-history-modal/equipment-order-history-modal.component';
import { TicketInterface } from 'shared';
import { LoginService } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
  imports: [
    IonNote,
    IonText,
    IonFooter,
    IonImg,
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
  photoService = inject(PhotoService);
  loginService = inject(LoginService);
  orderId?: number;
  orderReceived!: OrderInterface;
  userLogged = this.loginService.user;
  orderForm!: FormGroup;
  categories$?: Observable<CategoryInterface[]>;
  equipments$?: Observable<EquipmentInterface[]>;
  clientSelected?: UserInterface;
  technicianSelected?: UserInterface;
  orderStatuses$: Observable<OrderStatusInterface[]> =
    this.orderStatusService.order_statuses;
  selectOrderStatusDisabled = false;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;
  ticket?: TicketInterface | null;
  priceMask = priceMask;
  dateMask = dateMask;

  // Use form valueChanges to trigger computed updates
  private formChanges = signal(0);

  // Signal for pictures preview reactivity
  private picturesSignal = signal<string[]>([]);
  picturesPreview = computed(() => {
    const pics = this.picturesSignal();
    if (pics.length > 0) return pics;
    return (
      this.pictures?.controls
        .map((c) => c.get('webPath')?.value || c.get('path')?.value)
        .filter(Boolean) || []
    );
  });

  // Computed signals for derived state (replaces getters)
  totalPartsPrice = computed(() => {
    this.formChanges(); // Trigger recomputation when form changes
    const partsArray = this.parts;
    if (!partsArray) return 0;
    return partsArray.controls.reduce((total: number, part: any) => {
      const quantity = this.moneyService.parse(part.get('quantity')?.value);
      const price = this.moneyService.parse(part.get('price')?.value);
      return total + quantity * price;
    }, 0);
  });

  servicePrice = computed(() => {
    this.formChanges();
    return this.moneyService.parse(this.orderForm?.get('service_price')?.value);
  });

  discount = computed(() => {
    this.formChanges();
    return this.moneyService.parse(this.orderForm?.get('discount')?.value);
  });

  totalPrice = computed(() => {
    this.formChanges();
    return this.totalPartsPrice() + this.servicePrice() - this.discount();
  });

  // linkedSignal: when orderId changes, reset form state
  // Note: linkedSignal API - source is a function returning the source value
  // resetFormOnOrderChange = linkedSignal(() => this.orderId ?? 0, () => {
  //   this.orderForm?.reset();
  //   this.patchFormTotalPrice();
  // });

  public signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300,
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor() {
    addIcons({
      checkmarkDoneSharp,
      printSharp,
      trash,
      arrowBack,
      close,
      searchSharp,
      add,
      search,
    });
  }

  ngOnInit() {
    this.mountForm();
    this.getOrderStatuses();
    if (this.orderId) {
      this.getOrderDetailsById();
      this.patchFormTotalPrice();
    }
    if (this.ticket) {
      this.patchFormWithTicket(this.ticket);
    }
  }

  patchFormWithTicket(ticket: TicketInterface) {
    this.orderForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      status_id: ticket.status_id,
      user_id: ticket.user_id,
      equipment_id: ticket.equipment_id,
      user: ticket.user.name,
    });
    this.clientSelected = ticket.user;
    this.getUserEquipments();
  }

  get parts() {
    return this.orderForm.get('parts') as FormArray;
  }

  ngAfterViewInit() {
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
      attendant_id: [
        !this.orderReceived ? this.loginService.userSubject.value?.id : null,
        [Validators.required],
      ],
      status_id: [this.orderId ? this.orderId : 1, [Validators.required]],
      service_description: [''],
      diagnostic: [''],
      signature: [''],
      parts: this.formBuilder.array([]),
      obs: [''],
      service_price: [0],
      parts_price: [0],
      total_price: [0],
      discount: [0],
      pictures: this.formBuilder.array([]),
    });

    // Subscribe to form changes to trigger computed signal updates
    this.orderForm.valueChanges.subscribe(() => {
      this.formChanges.update((v) => v + 1);
    });
  }

  get pictures() {
    return this.orderForm.get('pictures') as FormArray;
  }

  addPicture(picture: PictureInterface) {
    this.pictures.push(
      this.formBuilder.group({
        webPath: [picture.webPath, Validators.required], // preview
        blob: [picture.blob, Validators.required], // upload
        format: [picture.format],
      }),
    );
    // Trigger computed update for FormArray changes
    this.formChanges.update((v) => v + 1);
    // Update pictures preview signal
    this.picturesSignal.update((arr) => [...arr, picture.webPath || '']);
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
        parts_price: this.totalPartsPrice(),
        total_price: this.totalPrice().toFixed(2),
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
    // Trigger computed update for FormArray changes
    this.formChanges.update((v) => v + 1);
  }

  addPictures(pictures: PictureInterface[]) {
    if (pictures.length === 0) return;

    pictures.forEach((picture) => {
      this.pictures.push(
        this.formBuilder.group({
          path: [picture.path],
          id: [picture.id],
        }),
      );
    });
    // Update pictures preview signal
    this.picturesSignal.update((arr) => [
      ...arr,
      ...pictures.map((p) => p.path || p.webPath || ''),
    ]);
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
    // Trigger computed update for FormArray changes
    this.formChanges.update((v) => v + 1);
  }

  removePart(index: number) {
    this.parts.removeAt(index);
    // Trigger computed update for FormArray changes
    this.formChanges.update((v) => v + 1);
  }

  getUserEquipments() {
    this.equipmentService
      .getUserEquipments(this.clientSelected!.id)
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
        signature: order.signature
          ? this.signaturePad()?.fromDataURL(order.signature)
          : '',
      });
      this.clientSelected = order.user;
      this.technicianSelected = order.technician;
      this.addParts(order.parts);
      this.addPictures(order.pictures);
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
    const orderData = this.orderForm.value;
    if (this.ticket) {
      orderData.ticket_id = this.ticket.id;
    }
    this.orderService
      .create(orderData, this.pictures.value)
      .subscribe((order) => {
        this.toastService.presentToast(
          'Ordem criada com sucesso',
          'bottom',
          4000,
          'success',
        );
        this.modalService.closeModal(
          this.ticket ? (orderData.order_id = order.id) : null,
          'confirm',
        );
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
            this.modalService.closeModal();
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

    orderStatus == OrderStatusEnum.DELIVERED && this.orderReceived
      ? this.confirmOrderFinalization()
      : false;
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
    this.modalService.closeModal();
    this.router.navigate(['/imprimir', this.orderId]);
  }

  async takePicture() {
    const picture = await this.photoService.takePicture();

    if (!picture) {
      return;
    }

    const blob = await fetch(picture.webPath!).then((r) => r.blob());

    this.addPicture({
      webPath: picture.webPath!,
      blob,
      format: picture.format,
    });
  }

  showImage(picture: PictureInterface) {
    this.modalService.openModal(ModalImageComponent, {
      imageUrl: picture,
    });
  }

  openModalEquipmentHistory() {
    this.modalService.openModal(
      EquipmentOrderHistoryModalComponent,
      { equipmentId: this.orderForm.get('equipment_id')?.value },
      'full-modal',
    );
  }
}
