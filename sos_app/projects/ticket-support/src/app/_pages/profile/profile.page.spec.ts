import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { LoginService } from 'shared';
import { LoadingService } from 'shared';
import { ToastService } from 'shared';
import { ModalService } from 'shared';
import { UserService } from '@ticket/app/_services/user.service';
import { PhotoService } from 'shared';
import { APP_CONFIG } from 'shared';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(waitForAsync(() => {
    // Create mocks for all services
    const loginService = jasmine.createSpyObj('LoginService', ['user']);
    loginService.user = of({ 
      cpf: '123.456.789-00',
      name: 'Test User',
      email: 'test@test.com',
      address: '',
      city: '',
      cnpj: '',
      corporate_name: '',
      district: '',
      fantasy_name: '',
      image: '',
      phone: '',
      state: '',
      doc_type: '1'
    });

    const loadingService = jasmine.createSpyObj('LoadingService', ['isLoading$']);
    loadingService.isLoading$ = of(false);

    const toastService = jasmine.createSpyObj('ToastService', ['presentToast']);

    const modalService = jasmine.createSpyObj('ModalService', ['closeModal']);

    const userService = jasmine.createSpyObj('UserService', ['updateUser']);

    const photoService = jasmine.createSpyObj('PhotoService', ['takePicture']);
    photoService.takePicture.and.resolveTo(null); // mock the promise

    const formBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
    // We need to mock the form group that is returned by formBuilder.group
    const formGroup = jasmine.createSpyObj('FormGroup', ['patchValue', 'get', 'value', 'setErrors']);
    formGroup.value = {};
    formBuilder.group.and.returnValue(formGroup);

    TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        { provide: APP_CONFIG, useValue: { 
            baseUrl: 'http://localhost:3000',
            reverbPort: 8080,
            reverbHost: 'localhost',
            reverbKey: 'test-key',
            wsPort: 6001,
            wsHost: 'localhost',
            wsScheme: 'ws',
            authEndpoint: '/sanctum/token',
          } },
        { provide: LoginService, useValue: loginService },
        { provide: LoadingService, useValue: loadingService },
        { provide: ToastService, useValue: toastService },
        { provide: ModalService, useValue: modalService },
        { provide: UserService, useValue: userService },
        { provide: PhotoService, useValue: photoService },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    });
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});