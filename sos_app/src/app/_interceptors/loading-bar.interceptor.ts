import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingBarInterceptor implements HttpInterceptor {
  private request = 0;
  private loadingBar: HTMLIonProgressBarElement;

  constructor() {
    this.loadingBar = document.createElement('ion-progress-bar');
    this.loadingBar.type = 'indeterminate';
    this.loadingBar.color = 'tertiary';
    this.loadingBar.style.height = '5px';
    this.loadingBar.style.opacity = '1';
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.request++;

    if (this.request === 1) {
      this.show();
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.request--;
        if (this.request == 0) {
          setTimeout(() => {
            this.hide();
          }, 250);
        }
      })
    );
  }

  private show() {
    document.body.appendChild(this.loadingBar);
  }

  private hide() {
    if (this.loadingBar && this.loadingBar.parentElement) {
      this.loadingBar.parentElement.removeChild(this.loadingBar);
    }
  }
}
