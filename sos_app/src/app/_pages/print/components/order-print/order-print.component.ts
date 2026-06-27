import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { phoneMask } from 'src/app/_masks/phoneMask';
import { BusinessInfoInterface } from 'src/app/_interfaces/BusinessInfoInterface';
import { OrderInterface } from 'src/app/_interfaces/OrderInterface';
import { OrderService } from 'src/app/_services/order.service';
import { SettingService } from 'src/app/_services/setting.service';
import { NgxPrintDirective } from 'ngx-print';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormatPhonePipe } from 'src/app/_pipes/format-phone.pipe';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss'],
  imports: [
    NgxPrintDirective,
    IonicModule,
    AsyncPipe,
    CurrencyPipe,
    UpperCasePipe,
  ],
})
export class OrderPrintComponent implements OnInit {
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  settingService = inject(SettingService);

  orderInfo!: Observable<OrderInterface>;
  businessInfo!: Observable<BusinessInfoInterface>;

  orderPrintStyle = {
    p: { margin: '2px !important', color: 'black' },
    img: { width: '125px', height: '125px' },
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
    this.orderService.getById(+this.getOrderId()!).subscribe((res) => {
      this.orderInfo = this.orderService.order$;
    });
  }

  getBusinessInfo() {
    this.settingService.getBusinessInfo().subscribe((res) => {
      this.businessInfo = this.settingService.businessInfo$;
    });
  }
}
