import { Routes } from '@angular/router';
import { loginGuard } from './_guards/login.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./_pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/home/home.page').then((m) => m.HomePage),
  },
];
