import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { EquipmentInterface } from 'shared';
import { PaginateInterface } from 'shared';
import { UserInterface } from 'shared';

describe('EquipmentService', () => {
  let service: EquipmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EquipmentService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EquipmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have equipmentsSubject as a BehaviorSubject', () => {
    expect(service.equipmentsSubject).toBeTruthy();
    expect(service.equipmentsSubject instanceof BehaviorSubject).toBeTruthy();
  });

  it('should have a getEquipments method', () => {
    expect(service.getEquipments).toBeTruthy();
  });

  it('should have a addEquipment method', () => {
    expect(service.addEquipment).toBeTruthy();
  });

  it('should have a updateEquipment method', () => {
    expect(service.updateEquipment).toBeTruthy();
  });

  it('should have load equipments from getEquipments method', async () => {
    // 1. Crie o array de equipamentos que ficará dentro da paginação
    const equipmentList: EquipmentInterface[] = [
      {
        id: 1,
        name: 'Equipment 1',
        description: 'Equipment 1 description',
        created_at: new Date(),
        updated_at: new Date(),
        image: [],
        category_id: 1,
        parts: [],
      } as any,
    ];

    // 2. Monte o objeto de paginação completo seguindo a sua interface
    const mockPaginatedEquipments: PaginateInterface<EquipmentInterface[]> = {
      current_page: 1,
      data: equipmentList, // O array entra aqui
      first_page_url: 'http://localhost:9004/api/equipments?page=1',
      from: 1,
      next_page_url: 'http://localhost:9004/api/equipments?page=2',
      path: 'http://localhost:9004/api/equipments',
      per_page: 10,
      prev_page_url: '',
      last_page_url: 'http://localhost:9004/api/equipments?page=5',
      to: 2,
      total: 50,
      last_page: 5,
    };
    const equipments$ = service.getEquipments();

    const equipmentsPromisse = firstValueFrom(equipments$);

    const req = httpTestingController.expectOne((req) => {
      return req.url.endsWith('/equipments/filter') && req.method === 'POST';
    });

    expect(req.request.method).toBe('POST');

    req.flush(mockPaginatedEquipments);

    const result = await equipmentsPromisse;
    expect(result).toEqual(mockPaginatedEquipments);
  });

  it('should have add equipment from addEquipment method', async () => {
    const equipment: EquipmentInterface = {
      id: 1,
      name: 'Equipment 1',
      description: 'Equipment 1 description',
      created_at: new Date(),
      updated_at: new Date(),
      image: [],
      category_id: 1,
      parts: [],
    } as any;
    const equipment$ = service.addEquipment(equipment);

    const equipmentPromisse = firstValueFrom(equipment$);

    const req = httpTestingController.expectOne((req) => {
      return req.url.endsWith('/equipments') && req.method === 'POST';
    });

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(equipment);

    req.flush(equipment);

    const result = await equipmentPromisse;
    expect(result).toEqual(equipment);
  });

  it('should have update equipment from updateEquipment method', async () => {
    const equipment: EquipmentInterface = {
      id: 1,
      name: 'Equipment 1',
      description: 'Equipment 1 description',
      created_at: new Date(),
      updated_at: new Date(),
      image: [],
      category_id: 1,
      parts: [],
    } as any;
    const equipment$ = service.updateEquipment(equipment, 1);

    const equipmentPromisse = firstValueFrom(equipment$);

    const req = httpTestingController.expectOne((req) => {
      return req.url.endsWith('/equipments/1') && req.method === 'PUT';
    });

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(equipment);

    req.flush(equipment);

    const result = await equipmentPromisse;
    expect(result).toEqual(equipment);
  });
});
