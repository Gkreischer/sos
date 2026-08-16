import { Component, inject, Signal, signal, ChangeDetectionStrategy, effect, DestroyRef } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { OrderService } from 'src/app/_services/order.service';
import { OrderModalComponent } from '../order-modal/order-modal.component';

import { map } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/core';

import { OrderFilterInterface } from 'shared';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { LoadingService } from 'shared';
import { addIcons } from 'ionicons';
import { calendar, hardwareChip, person } from 'ionicons/icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonChip,
    IonSpinner,
    IonLabel,
    IonItem,
    IonList,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    IonCard,
    AsyncPipe,
    DatePipe,
    NgClass,
  ],
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
  private destroyRef = inject(DestroyRef);
  
  constructor() {
      addIcons({
        calendar,
        hardwareChip,
        person,
      });
      this.orderService
        .getAll(this.ordersPage, this.orderFilters())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });

      // Watch for filter changes and reset
      effect(() => {
        const filters = this.orderFilters();

        this.ordersPage = 1;
        this.infiniteScroll.set(true);

        this.orderService
          .getAll(this.ordersPage, filters ?? undefined)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res) => {
            if (res.current_page >= res.last_page) {
              this.infiniteScroll.set(false);
            }
          });
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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          event.target.complete();
          if (res.current_page >= res.last_page) {
            this.infiniteScroll.set(false);
          }
        });
    }
}
