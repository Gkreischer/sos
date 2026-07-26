import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { from, switchMap } from 'rxjs';
import { LoginService } from '../_services/login.service';
import { PreferencesPluginService } from '../_services/preferences-plugin.service';
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const preferencesPluginService = inject(PreferencesPluginService);

  return from(preferencesPluginService.get('_t')).pipe(
    switchMap((token) => {
      if (!token?.value) {
        loginService.logout();

        return next(req);
      }

      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      return next(clonedRequest);
    }),
  );
};
