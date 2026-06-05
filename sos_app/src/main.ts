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
    // 1. CORREÇÃO: BrowserModule REMOVIDO daqui. Não é necessário em aplicações Standalone!

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
          // firstValueFrom transforma o seu Observable do HTTP em uma Promise
          // fazendo o Angular esperar a resposta da API antes do F5 terminar
          await firstValueFrom(loginService.verifyToken(token.value));
        } catch (err) {
          // Opcional: deletar o token inválido aqui para limpar o storage
          await prefs.remove('_t');
          loginService.logout(); // Garante que o estado de login seja limpo
        }
      }
    }),
    // 2. Estratégia de rotas do Ionic e localização PT-BR
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Dica: mude para 'pt-BR' para evitar problemas com moedas/datas brasileiras
  ],
}).catch((err) => console.error(err));
