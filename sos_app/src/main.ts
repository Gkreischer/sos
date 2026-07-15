import {
  enableProdMode,
  LOCALE_ID,
  provideAppInitializer,
} from '@angular/core';
import { inject } from '@angular/core';
import { LoginService } from './app/_services/login.service';
import { PreferencesPluginService } from './app/_services/preferences-plugin.service';
import { firstValueFrom } from 'rxjs';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './app/_interceptors/authentication.interceptor';
import { errorInterceptor } from './app/_interceptors/error.interceptor';
import { loadingBarInterceptor } from './app/_interceptors/loading-bar.interceptor';

import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { routes } from './app/app.routes';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { bootstrapApplication } from '@angular/platform-browser'; // Removido o BrowserModule daqui
import { AppComponent } from './app/app.component';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';
import { errAndLoadingInterceptor } from './app/_interceptors/loading.interceptor';

registerLocaleData(localePtBr);
defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideCharts(withDefaultRegisterables()),
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
}).catch((err) => console.error(err));
