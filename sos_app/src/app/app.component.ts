import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuController, IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { inject } from '@angular/core';
import { LoginService } from './_services/login.service';
import { UserInterface } from './_interfaces/UserInterface';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonMenu,
  IonApp,
  IonContent,
  IonCard,
  IonImg,
  IonSplitPane,
  IonList,
  IonItem,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonButton,
} from '@ionic/angular/standalone';
import {
  settingsSharp,
  barChartSharp,
  peopleSharp,
  layersSharp,
  hardwareChipSharp,
  constructSharp,
  appsSharp,
  homeSharp,
  arrowBack,
  camera,
  addSharp,
  checkmarkDoneSharp,
  printSharp,
  searchSharp,
  close,
  trash,
  exit,
} from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    IonMenu,
    IonApp,
    IonContent,
    IonCard,
    IonImg,
    IonSplitPane,
    IonList,
    IonItem,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonButton,
  ],
})
export class AppComponent implements OnInit {
  menuController = inject(MenuController);
  loginService = inject(LoginService);
  router = inject(Router);
  user$ = this.loginService.user;

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
  constructor() {
    addIcons({
      settingsSharp,
      barChartSharp,
      peopleSharp,
      layersSharp,
      hardwareChipSharp,
      close,
      constructSharp,
      appsSharp,
      homeSharp,
      arrowBack,
      camera,
      addSharp,
      checkmarkDoneSharp,
      printSharp,
      searchSharp,
      trash,
      exit,
    });
  }

  ngOnInit() {
    this.verifyIfIsLogged();
  }

  async getToken() {
    return await this.loginService.preferencesPluginService.get('_t');
  }

  async verifyIfIsLogged() {
    this.user$.subscribe(async (user) => {
      if (user) {
        console.log(user);
        let result = await this.menuController.open('main');
        console.log(result);
      }
    });
  }

  logout() {
    this.loginService.logout();
  }
}
