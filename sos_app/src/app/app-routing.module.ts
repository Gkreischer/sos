import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { loginGuard } from './_guards/login.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./_pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'categorias',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/categories/categories.module').then(
        (m) => m.CategoriesPageModule,
      ),
  },
  {
    path: 'equipamentos',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/equipments/equipments.module').then(
        (m) => m.EquipmentsPageModule,
      ),
  },
  {
    path: 'usuarios',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/users/users.module').then((m) => m.UsersPageModule),
  },
  {
    path: 'ordem-servico',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/orders/order.module').then((m) => m.OrderPageModule),
  },
  {
    path: 'materiais',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/parts/parts.module').then((m) => m.PartsPageModule),
  },
  {
    path: 'configuracoes',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/settings/settings.module').then(
        (m) => m.SettingsPageModule,
      ),
  },
  {
    path: 'imprimir/:id',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/print/print.module').then((m) => m.PrintPageModule),
  },
  {
    path: 'relatorios',
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./_pages/metrics/metrics.module').then(
        (m) => m.MetricsPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
