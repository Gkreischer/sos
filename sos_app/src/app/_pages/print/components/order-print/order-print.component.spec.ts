import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderPrintComponent } from './order-print.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxPrintDirective } from 'ngx-print';

describe('OrderPrintComponent', () => {
  let component: OrderPrintComponent;
  let fixture: ComponentFixture<OrderPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ NgxPrintDirective, OrderPrintComponent],
    providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])],
}).compileComponents();

    fixture = TestBed.createComponent(OrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
