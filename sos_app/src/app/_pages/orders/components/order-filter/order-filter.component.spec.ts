import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderFilterComponent } from './order-filter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('OrderFilterComponent', () => {
  let component: OrderFilterComponent;
  let fixture: ComponentFixture<OrderFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrderFilterComponent],
      imports: [IonicModule.forRoot(), MaskitoDirective, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
