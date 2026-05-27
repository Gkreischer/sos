import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { inject } from '@angular/core';
import { LoginService } from './_services/login.service';
import { UserInterface } from './_interfaces/UserInterface';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  menuService = inject(MenuController);
  loginService = inject(LoginService);

  user!: Observable<UserInterface | null>;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home', id: 'button-sidebar-home' },
    {
      title: 'Categorias',
      url: '/categorias',
      icon: 'apps',
      id: 'button-sidebar-categorias',
    },
    {
      title: 'Equipamentos',
      url: '/equipamentos',
      icon: 'construct',
      id: 'button-sidebar-equipamentos',
    },
    {
      title: 'Materiais',
      url: '/materiais',
      icon: 'hardware-chip',
      id: 'button-sidebar-materiais',
    },
    {
      title: 'Ordem de Serviço',
      url: '/ordem-servico',
      icon: 'layers',
      id: 'button-sidebar-ordem-servico',
    },
    {
      title: 'Usuários',
      url: '/usuarios',
      icon: 'people',
      id: 'button-sidebar-usuarios',
    },
    {
      title: 'Relatórios',
      url: '/relatorios',
      icon: 'bar-chart',
      id: 'button-sidebar-relatorios',
    },
    {
      title: 'Configurações',
      url: '/configuracoes',
      icon: 'settings',
      id: 'button-sidebar-configuracoes',
    },
  ];
  constructor() {}

  ngOnInit() {
    this.disableMenu();
    this.verifyToken();
  }

  async disableMenu() {
    await this.menuService.enable(false, 'main');
  }

  async getToken() {
    return await this.loginService.preferencesPluginService.get('_t');
  }

  async verifyToken() {
    const token = await this.getToken();
    if (token.value) {
      this.loginService.verifyToken(token.value).subscribe((user) => {
        console.log(user);
        this.user = this.loginService.user;
      });
    }
  }
}
