import { Component, inject, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderModalComponent } from './components/order-modal/order-modal.component';
import { OrderStatusInterface } from 'src/app/_interfaces/OrderStatusInterface';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: false,
})
export class OrderPage implements OnInit {
  modalService = inject(ModalService);

  statusFilter!: OrderStatusInterface;

  constructor() {}

  ngOnInit() {}

  addOrder() {
    this.modalService.openModal(OrderModalComponent);
  }

  filterByStatus(status: OrderStatusInterface) {
    this.statusFilter = status;
  }
}
