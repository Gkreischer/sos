import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  LOCALE_ID,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { authenticationInterceptor } from './_interceptors/authentication.interceptor';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { loadingBarInterceptor } from './_interceptors/loading-bar.interceptor';
import { routes } from './app.routes';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { errAndLoadingInterceptor } from './_interceptors/loading.interceptor';
import { PreferencesPluginService } from './_services/preferences-plugin.service';
import { LoginService } from './_services/login.service';
import { firstValueFrom } from 'rxjs';
import { RouteReuseStrategy } from '@angular/router';

registerLocaleData(localePtBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(
      withInterceptors([
        authenticationInterceptor,
        loadingBarInterceptor,
        errorInterceptor,
        errAndLoadingInterceptor,
      ]),
    ),
    provideAppInitializer(async () => {
      const prefs = inject(PreferencesPluginService);
      const loginService = inject(LoginService);

      const token = await prefs.get('_t');
      if (token?.value) {
        try {
          await firstValueFrom(loginService.verifyToken(token.value));
        } catch (err) {
          await prefs.remove('_t');
          loginService.logout(); // Garante que o estado de login seja limpo
        }
      }
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
