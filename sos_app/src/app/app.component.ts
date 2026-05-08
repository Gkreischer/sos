import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Categorias', url: '/categorias', icon: 'apps' },
    { title: 'Equipamentos', url: '/equipamentos', icon: 'construct' },
    { title: 'Materiais', url: '/materiais', icon: 'hardware-chip' },
    { title: 'Ordem de Serviço', url: '/ordem-servico', icon: 'layers' },
    { title: 'Usuários', url: '/usuarios', icon: 'people' },
    { title: 'Configurações', url: '/configuracoes', icon: 'settings' },
  ];
  constructor() {}
}
