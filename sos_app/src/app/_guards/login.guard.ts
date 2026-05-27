import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';
import { PreferencesPluginService } from '../_services/preferences-plugin.service';
import { MenuController } from '@ionic/angular';
export const loginGuard: CanActivateFn = async (route, state) => {
  const menuController = inject(MenuController);
  const router = inject(Router);
  const preferencesPluginService = inject(PreferencesPluginService);

  const token = await preferencesPluginService.get('_t');

  if (!token.value) {
    router.navigate(['/login']);
    return false;
  }
  const menuOpen = await menuController.isOpen();
  if (!menuOpen) {
    menuController.enable(true, 'main');
  }
  return true;
};
