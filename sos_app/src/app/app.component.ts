import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Categorias', url: '/categories', icon: 'apps' },
    { title: 'Equipamentos', url: '/equipments', icon: 'hardware-chip' },
    { title: 'Usuários', url: '/users', icon: 'people' },
  ];
  constructor() {}
}
