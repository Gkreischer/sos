import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full',
  },
  {
    path: 'categories',
    loadChildren: () => import('./_pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },  {
    path: 'equipments',
    loadChildren: () => import('./_pages/equipments/equipments.module').then( m => m.EquipmentsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
