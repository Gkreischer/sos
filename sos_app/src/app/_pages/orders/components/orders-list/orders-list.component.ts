import { Component, inject, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderInterface } from 'src/app/_interfaces/OrderInterface';
import { ModalService } from 'src/app/_services/modal.service';
import { OrderService } from 'src/app/_services/order.service';
import { OrderModalComponent } from '../order-modal/order-modal.component';

import { map } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/core';

import { OrderFilterInterface } from 'src/app/_interfaces/OrderFilterInterface';
import { effect } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  imports: [IonicModule, AsyncPipe, DatePipe],
})
export class OrdersListComponent {
  orderService = inject(OrderService);
  modalService = inject(ModalService);
  loadingService = inject(LoadingService);
  orders$?: Observable<OrderInterface[]> = this.orderService.orders$;
  ordersPage: number = 1;
  infiniteScroll = signal(true);
  orderFilters: Signal<OrderFilterInterface | null> =
    this.orderService.orderFilters;

  isLoading$ = this.loadingService.isLoading$;
  constructor() {
    effect((onCleanup) => {
      const filters = this.orderFilters();

      this.ordersPage = 1;
      this.infiniteScroll.set(true);

      const subscription = this.orderService
        .getAll(this.ordersPage, filters ?? undefined)
        .subscribe((res) => {
          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });
      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  getOrders() {
    this.orderService
      .getAll(this.ordersPage, this.orderService.orderFilters())
      .subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
  }

  openModal(order: OrderInterface) {
    this.modalService.openModal(
      OrderModalComponent,
      { orderId: order.id },
      'full-modal',
    );
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.ordersPage++;

    this.orderService
      .getAll(this.ordersPage, this.orderService.orderFilters())
      .subscribe((res) => {
        event.target.complete();
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
  }
}
