import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderClientHistoryComponent } from './order-client-history.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('OrderClientHistoryComponent', () => {
  let component: OrderClientHistoryComponent;
  let fixture: ComponentFixture<OrderClientHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderClientHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
