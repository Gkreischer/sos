import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
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
  library,
  personCircle,
  construct,
  addCircle,
  chatbubblesSharp,
  saveOutline,
  closeSharp,
  searchCircle,
  pencilSharp,
  trashSharp,
  chevronUpCircle,
  qrCode,
} from 'ionicons/icons';
import { TourIonPopoverModule } from 'ngx-ui-tour-ionic';
import { ToastService } from './_services/toast.service';
import { PhotoService } from './_services/photo.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { UserLoginInterface } from './_interfaces/UserLoginInterface';
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
    TourIonPopoverModule,
  ],
})
export class AppComponent implements OnInit {
  menuController = inject(MenuController);
  loginService = inject(LoginService);
  router = inject(Router);
  toastService = inject(ToastService);
  photoService = inject(PhotoService);
  notificationService = inject(NotificationService);

  user$ = this.loginService.user;

  user!: Observable<UserInterface | null>;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home', id: 'button-sidebar-home' },
    {
      title: 'Categorias',
      url: '/categorias',
      icon: 'apps',
      id: 'button-sidebar-categorias',
      tourAnchor: 'menu.categories',
    },
    {
      title: 'Equipamentos',
      url: '/equipamentos',
      icon: 'construct',
      id: 'button-sidebar-equipamentos',
      tourAnchor: 'menu.equipments',
    },
    {
      title: 'Materiais',
      url: '/materiais',
      icon: 'hardware-chip',
      id: 'button-sidebar-materiais',
      tourAnchor: 'menu.parts',
    },
    {
      title: 'Ordem de Serviço',
      url: '/ordem-servico',
      icon: 'layers',
      id: 'button-sidebar-ordem-servico',
      tourAnchor: 'menu.os',
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: 'chatbubbles',
      id: 'button-sidebar-chat',
      tourAnchor: 'menu.chat',
    },
    {
      title: 'Usuários',
      url: '/usuarios',
      icon: 'people',
      id: 'button-sidebar-usuarios',
      tourAnchor: 'menu.users',
    },
    {
      title: 'Relatórios',
      url: '/relatorios',
      icon: 'bar-chart',
      id: 'button-sidebar-relatorios',
      tourAnchor: 'menu.metrics',
    },
    {
      title: 'Configurações',
      url: '/configuracoes',
      icon: 'settings',
      id: 'button-sidebar-configuracoes',
      tourAnchor: 'menu.settings',
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
      library,
      personCircle,
      construct,
      addCircle,
      chatbubblesSharp,
      saveOutline,
      closeSharp,
      searchCircle,
      pencilSharp,
      trashSharp,
      chevronUpCircle,
      qrCode,
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
        await this.menuController.open('main');
        if (user.type.name !== 'Administrador') {
          this.hideElementsMenuByTypeUser(user);
        }
      }
    });
  }

  hideElementsMenuByTypeUser(user: UserLoginInterface) {
    this.appPages.filter((page) => {
      return page.title != 'Relatórios' && page.title != 'Configurações';
    });
  }

  logout() {
    this.loginService.logout();
    this.notificationService.leave('notifications');
  }

  async changeAvatarImage() {
    await this.selectImage();
  }

  async uploadImage() {
    const response = await this.photoService.startUpload();

    if (!response) {
      this.toastService.presentToast(
        'Nenhum arquivo selecionado',
        'bottom',
        3000,
        'danger',
      );
      return;
    }
    this.loginService.updateAvatarImage(response.imagePath).subscribe();
    this.toastService.presentToast(response.message, 'bottom', 3000, 'success');
  }

  async selectImage() {
    const image = await this.photoService.selectImage();

    if (!image) {
      return;
    }

    await this.uploadImage();
  }
}
