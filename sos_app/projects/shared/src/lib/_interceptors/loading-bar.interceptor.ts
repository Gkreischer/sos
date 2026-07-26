import { HttpInterceptorFn } from '@angular/common/http';

import { finalize } from 'rxjs';

let requests = 0;

const loadingBar = document.createElement('ion-progress-bar') as HTMLElement & {
  type: string;
  color: string;
};

loadingBar.type = 'indeterminate';
loadingBar.color = 'tertiary';
loadingBar.style.height = '8px';
loadingBar.style.opacity = '1';
loadingBar.style.position = 'fixed';
loadingBar.style.top = '0';
loadingBar.style.left = '0';
loadingBar.style.width = '100%';
loadingBar.style.zIndex = '99999';

const show = () => {
  if (!loadingBar.parentElement) {
    document.body.appendChild(loadingBar);
  }
};

const hide = () => {
  if (loadingBar.parentElement) {
    loadingBar.parentElement.removeChild(loadingBar);
  }
};

export const loadingBarInterceptor: HttpInterceptorFn = (req, next) => {
  requests++;

  if (requests === 1) {
    show();
  }

  return next(req).pipe(
    finalize(() => {
      requests--;

      if (requests === 0) {
        setTimeout(() => {
          hide();
        }, 250);
      }
    }),
  );
};
