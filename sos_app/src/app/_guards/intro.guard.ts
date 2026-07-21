import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PreferencesPluginService } from '../_services/preferences-plugin.service';

export const introGuard: CanActivateFn = async (route, state) => {
  const preferenceService = inject(PreferencesPluginService);
  const router = inject(Router);
  const token = await preferenceService.get('_t');

  if (token) {
    await router.navigate(['/login']);
    return false;
  }
  return true;
};
