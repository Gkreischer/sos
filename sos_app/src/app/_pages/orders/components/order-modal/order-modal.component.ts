import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { CategoryService } from 'src/app/_services/category.service';
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

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private orderService: OrderService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getOrderDetailsById();
    this.mountForm();
    this.patchFormTotalPrice();
  }

  get parts() {
    return this.orderForm.get('parts') as FormArray;
  }

  get totalPartsPrice() {
    return this.parts.controls.reduce((total, part) => {
      const quantity = part.get('quantity')?.value || 0;
      const price = part.get('price')?.value || 0;
      return total + quantity * price;
    }, 0);
  }

  mountForm() {
    this.orderForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      equipment_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      technician_id: ['', [Validators.required]],
      parts: this.formBuilder.array([]),
      obs: [''],
      service_price: [''],
      parts_price: [''],
      total_price: [''],
    });
  }

  patchFormTotalPrice() {
    this.orderForm &&
      this.orderForm.patchValue({
        parts_price: this.totalPartsPrice,
        total_price:
          this.totalPartsPrice +
          parseFloat(this.orderForm.get('service_price')?.value),
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
        quantity: [part.quantity, [Validators.required]],
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
      order.equipment_id = order.equipment_id?.toString();
      this.orderForm.patchValue(order);
      this.clientSelected = order.user;
      this.addParts(order.order_parts);
      this.getUserEquipments();
      console.log('ordem recebida', order);
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

  submit() {
    console.log(this.orderForm.value);
  }

  update() {
    console.log('enviando', this.orderForm.value);
    this.orderService
      .update(+this.orderReceived.id, this.orderForm.value)
      .subscribe((order) => {
        console.log('ordem recebida', order);
        this.showUpdateSuccessToast();
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
}
