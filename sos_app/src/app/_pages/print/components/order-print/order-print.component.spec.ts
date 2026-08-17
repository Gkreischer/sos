import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderPrintComponent } from './order-print.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxPrintDirective } from 'ngx-print';
import { OrderService } from 'src/app/_services/order.service';
import { SettingService } from 'shared';
import { OrderInterface } from 'shared';
import { BusinessInfoInterface } from 'shared';
import { UserInterface } from 'shared';
import { EquipmentInterface } from 'shared';
import { OrderStatusInterface } from 'shared';
import { PartInterface } from 'shared';
import { PictureInterface } from 'shared';
import { CategoryInterface } from 'shared';
import { UserTypeInterface } from 'shared';
import { ImageInterface } from 'shared';
import { of } from 'rxjs';

const mockCategory: CategoryInterface = {
  id: 1,
  name: 'Category',
  created_at: new Date('2024-01-15T10:30:00Z'),
  updated_at: new Date('2024-01-15T10:30:00Z'),
};

const mockUserType: UserTypeInterface = {
  id: 1,
  name: 'Cliente',
  created_at: new Date('2024-01-15T10:30:00Z'),
  updated_at: new Date('2024-01-15T10:30:00Z'),
};

const mockImage: ImageInterface = {
  id: 1,
  name: 'test-image',
  path: new URL('https://example.com/image.png'),
};

const mockUser: UserInterface = {
  id: 1,
  name: 'Test Client',
  email: 'test@test.com',
  cpf: '12345678901',
  phone: '11999999999',
  address: 'Test Address',
  city: 'Test City',
  state: 'TS',
  country: 'Brazil',
  cep: '12345678',
  fantasy_name: 'Test Fantasy',
  corporate_name: 'Test Corp',
  cnpj: '12345678901234',
  image: 'https://example.com/avatar.png',
  type_id: 1,
  type: mockUserType,
  password: 'password',
  equipments: [],
  created_at: new Date('2024-01-15T10:30:00Z'),
  updated_at: new Date('2024-01-15T10:30:00Z'),
};

const mockEquipment: EquipmentInterface = {
  id: 1,
  name: 'Test Equipment',
  description: 'Test Description',
  category_id: 1,
  category: mockCategory,
  user: mockUser,
  parts: [],
  image: [mockImage],
  created_at: new Date('2024-01-15T10:30:00Z'),
  updated_at: new Date('2024-01-15T10:30:00Z'),
};

const mockTechnician: UserInterface = {
  ...mockUser,
  id: 2,
  name: 'Test Technician',
};

const mockStatus: OrderStatusInterface = {
  id: 1,
  name: 'Aberto',
  description: 'Aberto',
};

const mockParts: PartInterface[] = [
  { 
    id: 1, 
    name: 'Part 1', 
    quantity: 2, 
    price: 25, 
    description: '', 
    category_id: 1,
    category: mockCategory,
    image: 'https://example.com/part1.png'
  } as PartInterface,
  { 
    id: 2, 
    name: 'Part 2', 
    quantity: 1, 
    price: 40, 
    description: '', 
    category_id: 1,
    category: mockCategory,
    image: 'https://example.com/part2.png'
  } as PartInterface,
];

const mockPictures: PictureInterface[] = [];

const mockOrder: OrderInterface = {
  id: 1,
  title: 'Test Order',
  user_id: '1',
  equipment_id: 1,
  equipment: mockEquipment,
  total_price: 90,
  parts_price: 90,
  technician_id: 2,
  technician: mockTechnician,
  attendant_id: 1,
  attendant: mockUser,
  service_price: 100,
  service_description: 'Test Service Description',
  diagnostic: 'Test Diagnostic',
  parts: mockParts,
  description: 'Test Description',
  discount: 10,
  obs: 'Test Observation',
  status_id: 1,
  status: mockStatus,
  user: mockUser,
  signature: 'signature',
  pictures: mockPictures,
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

describe('OrderPrintComponent', () => {
  let component: OrderPrintComponent;
  let fixture: ComponentFixture<OrderPrintComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockSettingService: jasmine.SpyObj<SettingService>;

  beforeEach(waitForAsync(() => {
          mockOrderService = jasmine.createSpyObj('OrderService', ['getById'], {
            order$: of(mockOrder),
          });
          mockSettingService = jasmine.createSpyObj('SettingService', ['getBusinessInfo'], {
            businessInfo$: of(mockBusinessInfo),
          });
          // Ensure getBusinessInfo returns an observable to avoid "Cannot read properties of undefined (reading 'pipe')"
          mockSettingService.getBusinessInfo.and.returnValue(of(mockBusinessInfo));
          // Ensure getById returns an observable to avoid "Cannot read properties of undefined (reading 'pipe')"
          mockOrderService.getById.and.returnValue(of(mockOrder));

          TestBed.configureTestingModule({
            imports: [NgxPrintDirective, OrderPrintComponent],
            providers: [
              provideHttpClient(),
              provideHttpClientTesting(),
              provideRouter([{ path: 'print/:id', component: OrderPrintComponent }]),
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

          fixture = TestBed.createComponent(OrderPrintComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order data on init', () => {
    expect(mockOrderService.getById).toHaveBeenCalledWith(1);
  });

  it('should load business info on init', () => {
    expect(mockSettingService.getBusinessInfo).toHaveBeenCalled();
  });
});
