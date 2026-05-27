import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { errorInterceptor } from './_interceptors/error.interceptor';

import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { loadingBarInterceptor } from './_interceptors/loading-bar.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { authenticationInterceptor } from './_interceptors/authentication.interceptor';
import { withInterceptors } from '@angular/common/http';
registerLocaleData(localePtBr);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    provideHttpClient(
      withInterceptors([
        authenticationInterceptor,
        errorInterceptor,
        loadingBarInterceptor,
      ]),
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt' },
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
