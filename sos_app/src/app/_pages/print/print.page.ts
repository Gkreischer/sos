import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  orderService = inject(OrderService);
  constructor() {}

  ngOnInit() {
    this.getOrder();
  }

  getOrderId() {
    return this.activatedRoute.snapshot.paramMap.get('orderId') ?? null;
  }

  getOrder() {
    const orderId = this.getOrderId();
    if (orderId) {
      return this.orderService.getById(+orderId).subscribe((order) => {
        return order;
      });
    }
    return null;
  }
}
