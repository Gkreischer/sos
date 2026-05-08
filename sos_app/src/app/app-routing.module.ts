import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./_pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./_pages/categories/categories.module').then(
        (m) => m.CategoriesPageModule,
      ),
  },
  {
    path: 'equipamentos',
    loadChildren: () =>
      import('./_pages/equipments/equipments.module').then(
        (m) => m.EquipmentsPageModule,
      ),
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./_pages/users/users.module').then((m) => m.UsersPageModule),
  },
  {
    path: 'ordem-servico',
    loadChildren: () =>
      import('./_pages/orders/order.module').then((m) => m.OrderPageModule),
  },
  {
    path: 'materiais',
    loadChildren: () =>
      import('./_pages/parts/parts.module').then((m) => m.PartsPageModule),
  },
  {
    path: 'configuracoes',
    loadChildren: () =>
      import('./_pages/settings/settings.module').then(
        (m) => m.SettingsPageModule,
      ),
  },
  {
    path: 'imprimir/:id',
    loadChildren: () =>
      import('./_pages/print/print.module').then((m) => m.PrintPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
