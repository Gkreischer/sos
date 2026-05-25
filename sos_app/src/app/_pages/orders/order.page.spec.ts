import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderPage } from './order.page';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';

describe('OrderPage', () => {
  let component: OrderPage;
  let fixture: ComponentFixture<OrderPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(OrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
