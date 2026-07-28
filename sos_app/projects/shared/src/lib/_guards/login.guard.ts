import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { map, tap } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (loginService.userSubject.value) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });

  return false;
};
