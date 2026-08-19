import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  LOCALE_ID,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { APP_CONFIG, AppConfig } from 'shared';
import { provideRouter } from '@angular/router';
import { authenticationInterceptor } from 'shared';
import { errorInterceptor } from 'shared';
import { loadingBarInterceptor } from 'shared';
import { routes } from './app.routes';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { loadingInterceptor } from 'shared';
import { LoginService } from 'shared';
import { catchError, firstValueFrom, of } from 'rxjs';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '@env/environment';
registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    {
      provide: APP_CONFIG,
      useValue: {
        baseUrl: environment.baseUrl,
        reverbKey: environment.reverbKey,
        wsPort: environment.wsPort,
        wsHost: environment.wsHost,
        wsScheme: environment.wsScheme,
        authEndpoint: environment.authEndpoint,
      } satisfies AppConfig,
    },

    provideRouter(routes),
    provideIonicAngular(),

    provideHttpClient(
      withInterceptors([
        // authenticationInterceptor,
        loadingBarInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ]),
    ),

    provideAppInitializer(() => {
      const loginService = inject(LoginService);

      return firstValueFrom(
        loginService.loadUser().pipe(catchError(() => of(null))),
      );
    }),

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
