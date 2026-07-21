import { Routes } from '@angular/router';
import { loginGuard } from 'shared';
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
  {
    path: 'tickets',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/tickets/tickets.page').then((m) => m.TicketsPage),
  },
  {
    path: 'profile',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: '**',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
