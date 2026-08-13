import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { APP_CONFIG } from 'shared';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
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
        provideRouter(routes),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
