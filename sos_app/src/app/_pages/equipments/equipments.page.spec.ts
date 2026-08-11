import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EquipmentsPage } from './equipments.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { EquipmentService } from 'src/app/_services/equipment.service';
import { of } from 'rxjs';
import { APP_CONFIG } from 'projects/shared/src/lib/config/app.config';

describe('EquipmentsPage', () => {
  let component: EquipmentsPage;
  let fixture: ComponentFixture<EquipmentsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EquipmentsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        { provide: ModalService, useValue: jasmine.createSpyObj('ModalService', ['openModal', 'closeModal']) },
        { provide: EquipmentService, useValue: {
          getEquipments: jasmine.createSpy('getEquipments').and.returnValue(of([])),
          setEquipmentFilter: jasmine.createSpy('setEquipmentFilter'),
          equipmentFilter: jasmine.createSpy('equipmentFilter').and.returnValue(null),
          equipmentsSubject: { next: jasmine.createSpy('next') }
        }},
        { provide: APP_CONFIG, useValue: {
          baseUrl: '',
          reverbPort: 0,
          reverbHost: '',
          reverbKey: '',
          wsPort: 0,
          wsHost: '',
          wsScheme: '',
          authEndpoint: ''
        }},
        { provide: '_HttpClient', useValue: {} }
      ],
    });
    fixture = TestBed.createComponent(EquipmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});