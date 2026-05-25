import { TestBed } from '@angular/core/testing';

import { MetricsService } from './metrics.service';
import { provideHttpClient } from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('MetricsService', () => {
  let service: MetricsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideHttpClient()],
    });
    service = TestBed.inject(MetricsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have orderCountByMonthMetric as a signal', () => {
    expect(service.orderCountByMonthMetric).toBeTruthy();
    expect(typeof service.orderCountByMonthMetric).toBe('function');
  });

  it('should have orderStatusMetrics as a signal', () => {
    expect(service.orderStatusMetrics).toBeTruthy();
    expect(typeof service.orderStatusMetrics).toBe('function');
  });

  it('should have orderTotalPriceByMonthMetric as a signal', () => {
    expect(service.orderTotalPriceByMonthMetric).toBeTruthy();
    expect(typeof service.orderTotalPriceByMonthMetric).toBe('function');
  });

  it('should have orderTotalPriceByStatus as a signal', () => {
    expect(service.orderTotalPriceByStatus).toBeTruthy();
    expect(typeof service.orderTotalPriceByStatus).toBe('function');
  });

  it('should have startDate$ as a signal', () => {
    expect(service.startDate$).toBeTruthy();
    expect(typeof service.startDate$).toBe('function');
  });

  it('should have endDate$ as a signal', () => {
    expect(service.endDate$).toBeTruthy();
    expect(typeof service.endDate$).toBe('function');
  });
});
