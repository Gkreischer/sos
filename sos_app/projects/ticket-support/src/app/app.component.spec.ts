import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from 'shared';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, IonicModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideIonicAngular(),
        provideRouter([]),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
