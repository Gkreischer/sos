import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderModalComponent } from './components/order-modal/order-modal.component';
import { OrderStatus } from 'src/app/_models/OrderStatus';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  statusFilter!: OrderStatus;

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  addOrder() {
    this.modalService.openModal(OrderModalComponent);
  }

  filterByStatus(status: OrderStatus) {
    this.statusFilter = status;
  }

}
