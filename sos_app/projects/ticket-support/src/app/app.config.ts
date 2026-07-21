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
import { PreferencesPluginService } from 'shared';
import { LoginService } from 'shared';
import { firstValueFrom } from 'rxjs';
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
        reverbPort: environment.reverbPort,
        reverbHost: environment.reverbHost,
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
        authenticationInterceptor,
        loadingBarInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ]),
    ),

    provideAppInitializer(async () => {
      const prefs: PreferencesPluginService = inject(PreferencesPluginService);
      const loginService: LoginService = inject(LoginService);

      const token = await prefs.get('_t');

      if (token?.value) {
        try {
          await firstValueFrom(loginService.verifyToken(token.value));
        } catch {
          await prefs.remove('_t');
          loginService.logout();
        }
      }
    }),

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
