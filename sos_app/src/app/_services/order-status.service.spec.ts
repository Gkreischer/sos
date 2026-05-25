import { TestBed } from '@angular/core/testing';

import { OrderStatusService } from './order-status.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

describe('OrderStatusService', () => {
  let service: OrderStatusService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderStatusService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have orderStatusesSubject as a BehaviorSubject', () => {
    expect(service['orderStatusSubject']).toBeInstanceOf(BehaviorSubject);
  });
});
