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
    path: 'categorias',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/categories/categories.page').then(
        (m) => m.CategoriesPage,
      ),
  },
  {
    path: 'equipamentos',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/equipments/equipments.page').then(
        (m) => m.EquipmentsPage,
      ),
  },
  {
    path: 'usuarios',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/users/users.page').then((m) => m.UsersPage),
  },
  {
    path: 'ordem-servico',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/orders/order.page').then((m) => m.OrderPage),
  },
  {
    path: 'materiais',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/parts/parts.page').then((m) => m.PartsPage),
  },
  {
    path: 'configuracoes',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'imprimir/:id',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/print/print.page').then((m) => m.PrintPage),
  },
  {
    path: 'relatorios',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/metrics/metrics.page').then((m) => m.MetricsPage),
  },
  {
    path: 'posts',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/posts/posts.page').then((m) => m.PostsPage),
  },
  {
    path: 'chat',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./_pages/chat/chat.page').then((m) => m.ChatPage),
  },
  {
    path: 'chamados',
    canActivate: [loginGuard],

    loadComponent: () =>
      import('./_pages/tickets/tickets.page').then((m) => m.TicketsPage),
  },
  {
    path: 'atividades',
    canActivate: [loginGuard],

    loadComponent: () =>
      import('./_pages/activities/activities.page').then(
        (m) => m.ActivitiesPage,
      ),
  },
];
