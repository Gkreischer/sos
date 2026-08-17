import {Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessInfoInterface } from 'shared';
import { OrderInterface } from 'shared';
import { OrderService } from 'src/app/_services/order.service';
import { SettingService } from 'shared';
import { NgxPrintDirective } from 'ngx-print';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  UpperCasePipe,
} from '@angular/common';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss'],
  imports: [
    IonCardContent,
    IonCard,
    NgxPrintDirective,
    AsyncPipe,
    CurrencyPipe,
    UpperCasePipe,
    DatePipe,
  ],
})
export class OrderPrintComponent implements OnInit {
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  settingService = inject(SettingService);
  private destroyRef = inject(DestroyRef);

  orderInfo$!: Observable<OrderInterface>;
  businessInfo$!: Observable<BusinessInfoInterface>;

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
    const orderId = +this.getOrderId()!;
    // Fetch the order data
    this.orderService.getById(orderId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    // Subscribe to the service's observable directly - this triggers OnPush change detection
    this.orderInfo$ = this.orderService.order$;
  }

  getBusinessInfo() {
    this.settingService.getBusinessInfo().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.businessInfo$ = this.settingService.businessInfo$;
  }
}
