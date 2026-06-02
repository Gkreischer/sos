import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PreferencesPluginService } from '../_services/preferences-plugin.service';
import { MenuController } from '@ionic/angular';

export const loginGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const preferencesPluginService = inject(PreferencesPluginService);

  const token = await preferencesPluginService.get('_t');

  if (!token.value) {
    // state.url contém o caminho completo que o usuário tentou acessar (ex: /produtos/detalhes)
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
