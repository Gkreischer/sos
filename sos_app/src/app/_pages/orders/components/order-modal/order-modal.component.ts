import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { ModalService } from 'src/app/_services/modal.service';
import { User } from 'src/app/_models/User';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { Equipment } from 'src/app/_models/Equipment';
import { OrderService } from 'src/app/_services/order.service';
import { Order } from 'src/app/_models/Order';
import { AlertService } from 'src/app/_services/alert.service';
import { ModalAddPartComponent } from '../modal-add-part/modal-add-part.component';
import { Part } from 'src/app/_models/Part';
import { ToastService } from 'src/app/_services/toast.service';
import { OrderStatusService } from 'src/app/_services/order-status.service';
import { OrderStatus } from 'src/app/_models/OrderStatus';
import { MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import priceMask from 'src/app/_masks/priceMask';
import { MoneyService } from 'src/app/_shared/utils/money.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
})
export class OrderModalComponent implements OnInit {
  orderId?: number;
  orderReceived!: Order;
  orderForm!: FormGroup;
  categories$?: Observable<Category[]>;
  equipments$?: Observable<Equipment[]>;
  clientSelected?: User;
  technicianSelected?: User;
  orderStatuses$?: Observable<OrderStatus[]>;
  selectOrderStatusDisabled = false;
  priceMask = priceMask;

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as unknown as HTMLIonInputElement).getInputElement();

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private orderService: OrderService,
    private alertService: AlertService,
    private toastService: ToastService,
    private orderStatusService: OrderStatusService,
    private moneyService: MoneyService,
    private router: Router,
  ) {}

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

  mountForm() {
    this.orderForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      equipment_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      technician_id: [''],
      status_id: [this.orderId ? this.orderId : 1, [Validators.required]],
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

    if (orderStatus != 4) {
      console.log(orderStatus);
      return;
    }
    this.selectOrderStatusDisabled = true;
  }

  patchFormTotalPrice() {
    this.orderForm &&
      this.orderForm.patchValue({
        parts_price: this.totalPartsPrice,
        total_price: this.totalPrice.toFixed(2),
      });
  }

  addParts(parts: Part[]) {
    if (parts.length === 0) {
      return;
    }

    parts.forEach((part) => {
      this.parts.push(
        this.formBuilder.group({
          part_id: [part.id, [Validators.required]],
          name: [part.name, [Validators.required]],
          quantity: [part.quantity, [Validators.required]],
          price: [part.price, [Validators.required]],
        }),
      );
    });
  }

  addPart(part: Part) {
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
      order.equipment_id = order.equipment_id;
      this.orderForm.patchValue(order);
      this.clientSelected = order.user;
      this.technicianSelected = order.technician;
      this.addParts(order.order_parts);
      this.getUserEquipments();
      console.log('ordem recebida', order);
      this.disabledSelectForDeliveredStatus();
      this.patchFormTotalPrice();
    });
  }

  async selectClientId() {
    let client = await this.modalService.openModal(UsersListComponent, {
      returnClientIdMode: true,
    });

    if (client) {
      console.log('clientRecebido', client);
      this.orderForm.get('user_id')?.setValue(client.id);
      this.clientSelected = client;
      this.getUserEquipments();
    }
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
    console.log('enviando', this.orderForm.value);
    this.orderService
      .update(+this.orderReceived.id, this.orderForm.value)
      .subscribe((order) => {
        console.log('ordem recebida', order);
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
    this.orderStatusService.getOrderStatuses().subscribe((data) => {
      this.orderStatuses$ = this.orderStatusService.order_statuses;
    });
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
          handler: () => {
            console.log('ordem finalizada');
          },
        },
      ],
    );
  }

  print() {
    this.closeModal();
    this.router.navigate(['/imprimir', this.orderId]);
  }
}
