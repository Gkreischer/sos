import {
  enableProdMode,
  LOCALE_ID,
  provideAppInitializer,
} from '@angular/core';
import { inject } from '@angular/core';
import { LoginService } from 'shared';
import { PreferencesPluginService } from 'shared';
import { firstValueFrom } from 'rxjs';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from 'shared';
import { errorInterceptor } from 'shared';
import { loadingBarInterceptor } from 'shared';
import { APP_CONFIG, AppConfig } from 'shared';
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
import { loadingInterceptor } from 'shared';

registerLocaleData(localePtBr);
defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
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
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideCharts(withDefaultRegisterables()),

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
        } catch (err) {
          await prefs.remove('_t');
          loginService.logout();
        }
      }
    }),

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
}).catch((err) => console.error(err));
