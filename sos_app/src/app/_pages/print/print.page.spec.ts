import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrintPage } from './print.page';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { BarcodePrintComponent } from './components/barcode-print/barcode-print.component';
import { OrderService } from 'src/app/_services/order.service';
import { SettingService } from 'shared';
import { of } from 'rxjs';
import { OrderInterface } from 'shared';
import { BusinessInfoInterface } from 'shared';

// Mock data
const mockOrder: OrderInterface = {
  id: 1,
  title: 'Test Order',
  user_id: '1',
  equipment_id: 1,
  equipment: {} as any,
  total_price: 90,
  parts_price: 90,
  technician_id: 2,
  technician: {} as any,
  attendant_id: 1,
  attendant: {} as any,
  service_price: 100,
  service_description: 'Test Service Description',
  diagnostic: 'Test Diagnostic',
  parts: [],
  description: 'Test Description',
  discount: 10,
  obs: 'Test Observation',
  status_id: 1,
  status: {} as any,
  user: {} as any,
  signature: 'signature',
  pictures: [],
  created_at: new Date('2024-01-15T10:30:00Z'),
  updated_at: new Date('2024-01-15T10:30:00Z'),
};

const mockBusinessInfo: BusinessInfoInterface = {
  id: 1,
  name: 'Test Company',
  cnpj: '12345678901234',
  email: 'test@company.com',
  phone: '11999999999',
  address: 'Test Address',
  address_number: 123,
  cep: '12345678',
  state: 'TS',
  city: 'Test City',
  country: 'Brazil',
  image: 'https://example.com/logo.png',
  website: 'https://test.com',
};

describe('PrintPage', () => {
  let component: PrintPage;
  let fixture: ComponentFixture<PrintPage>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockSettingService: jasmine.SpyObj<SettingService>;

  beforeEach(waitForAsync(() => {
    mockOrderService = jasmine.createSpyObj('OrderService', ['getById'], {
      order$: of(mockOrder),
    });
    mockSettingService = jasmine.createSpyObj('SettingService', ['getBusinessInfo'], {
      businessInfo$: of(mockBusinessInfo),
    });
    mockOrderService.getById.and.returnValue(of(mockOrder));
    mockSettingService.getBusinessInfo.and.returnValue(of(mockBusinessInfo));

    TestBed.configureTestingModule({
      imports: [OrderPrintComponent, BarcodePrintComponent, PrintPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
        { provide: OrderService, useValue: mockOrderService },
        { provide: SettingService, useValue: mockSettingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
