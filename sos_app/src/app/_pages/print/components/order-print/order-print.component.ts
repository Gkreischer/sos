import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessInfoInterface } from 'src/app/_models/BusinessInfo';
import { Order } from 'src/app/_models/Order';
import { OrderService } from 'src/app/_services/order.service';
import { SettingService } from 'src/app/_services/setting.service';

@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss'],
})
export class OrderPrintComponent implements OnInit {
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  settingService = inject(SettingService);

  order!: Observable<Order>;
  businessInfo!: Observable<BusinessInfoInterface>;

  orderPrintStyle = {
    p: { padding: '0 !important' },
    '.signs': { display: 'flex', 'justify-content': 'space-around' },
  };

  constructor() {}

  ngOnInit() {
    this.getBusinessInfo();
    this.getOrderData();
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id') ?? null;
  }

  getOrderData() {
    this.orderService.getById(+this.getOrderId()!).subscribe((order) => {
      this.order = this.orderService.order$;
    });
  }

  getBusinessInfo() {
    this.settingService.getBusinessInfo().subscribe((data) => {
      this.businessInfo = this.settingService.businessInfo$;
    });
  }
}
