import { enableProdMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './app/_interceptors/authentication.interceptor';
import { errorInterceptor } from './app/_interceptors/error.interceptor';
import { loadingBarInterceptor } from './app/_interceptors/loading-bar.interceptor';

// 1. IMPORTAÇÕES DAS ROTAS: Adicione o provideRouter e as estratégias de preload
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { routes } from './app/app.routes'; // Certifique-se de criar o arquivo app.routes.ts que fizemos antes

import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePtBr);
defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, IonicModule.forRoot()),

    // 2. CONFIGURAÇÃO DAS ROTAS: Adicionado aqui no array de providers
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(
      withInterceptors([
        authenticationInterceptor,
        loadingBarInterceptor,
        errorInterceptor,
      ]),
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt' },
    provideCharts(withDefaultRegisterables()),
  ],
}).catch((err) => console.log(err));
