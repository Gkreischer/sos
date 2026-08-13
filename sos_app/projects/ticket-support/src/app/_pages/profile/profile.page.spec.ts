import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { of } from 'rxjs';
import { LoginService } from 'shared';
import { LoadingService } from 'shared';
import { ToastService } from 'shared';
import { ModalService } from 'shared';
import { UserService } from '@ticket/app/_services/user.service';
import { PhotoService } from 'shared';
import { APP_CONFIG } from 'shared';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';
describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
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
      doc_type: '1',
    });

    const loadingService = jasmine.createSpyObj('LoadingService', [
      'isLoading$',
    ]);
    loadingService.isLoading$ = of(false);

    const toastService = jasmine.createSpyObj('ToastService', ['presentToast']);

    const modalService = jasmine.createSpyObj('ModalService', ['closeModal']);

    const userService = jasmine.createSpyObj('UserService', ['updateUser']);

    const photoService = jasmine.createSpyObj('PhotoService', ['takePicture']);
    photoService.takePicture.and.resolveTo(null); // mock the promise

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            baseUrl: environment.baseUrl,
            reverbPort: environment.reverbPort,
            reverbHost: environment.reverbHost,
            reverbKey: environment.reverbKey,
            wsPort: environment.wsPort,
            wsHost: environment.wsHost,
            wsScheme: environment.wsScheme,
            authEndpoint: environment.authEndpoint,
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),

        { provide: LoginService, useValue: loginService },
        { provide: LoadingService, useValue: loadingService },
        { provide: ToastService, useValue: toastService },
        { provide: ModalService, useValue: modalService },
        { provide: UserService, useValue: userService },
        { provide: PhotoService, useValue: photoService },
      ],
    });
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
