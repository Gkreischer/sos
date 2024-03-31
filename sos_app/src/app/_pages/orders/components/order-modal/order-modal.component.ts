import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/_models/Category';
import { UsersListComponent } from 'src/app/_pages/users/components/users-list/users-list.component';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { User} from 'src/app/_models/User';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { Equipment } from 'src/app/_models/Equipment';
@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
})
export class OrderModalComponent  implements OnInit {

  orderId?: number;
  orderForm!: FormGroup;
  categories$?: Observable<Category[]>;
  equipments$?: Observable<Equipment[]>;
  clientSelected?: User;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService
  ) { }

  ngOnInit() {
    this.getOrderId();
    this.mountForm();
  }

  get client() {
    return this.orderForm.get('user_id')?.value;
  }


  mountForm() {
    this.orderForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      equipment_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      technician_id: ['', [Validators.required]],
      obs: [''],
      service_price: [''],
      parts_price: [''],
      total_price: [''],
    });
  }

  getUserEquipments() {
    this.equipments$ = this.equipmentService.getUserEquipments(this.clientSelected!);
  }

  getOrderId() {
    console.log(this.orderId);
  }

  async selectClientId() {
    let client = await this.modalService.openModal(UsersListComponent, {returnClientIdMode: true});

    if(client) {
      console.log('clientRecebido', client)
      this.orderForm.get('user_id')?.setValue(client.id);
      this.clientSelected = client;
      this.getUserEquipments();
    }
  }

  closeModal() {
    this.modalService.closeModal();
  }

}
