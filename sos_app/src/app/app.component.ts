import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Categorias', url: '/categorias', icon: 'apps' },
    { title: 'Equipamentos', url: '/equipamentos', icon: 'hardware-chip' },
    { title: 'Usuários', url: '/usuarios', icon: 'people' },
    { title: 'Ordem de Serviço', url: '/ordem-servico', icon: 'layers' },
  ];
  constructor() {}
}
