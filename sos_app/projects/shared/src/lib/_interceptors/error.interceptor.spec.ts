import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../_services/toast.service';
import { LoginService } from '../_services/login.service';

describe('ErrorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),

        {
          provide: ToastService,
          useValue: {
            presentToast: jasmine.createSpy('presentToast'),
          },
        },

        {
          provide: LoginService,
          useValue: {
            logout: jasmine.createSpy('logout'),
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(errorInterceptor).toBeTruthy();
  });
});
