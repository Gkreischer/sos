import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { inject } from '@angular/core';
import { LoginService } from 'shared';
import { UserInterface } from 'projects/shared/src/lib/_interfaces/UserInterface';
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
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonButton,
  IonBadge,
  IonText,
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
  contractSharp,
  earSharp,
} from 'ionicons/icons';
import { TourIonPopoverModule } from 'ngx-ui-tour-ionic';
import { ToastService } from './_services/toast.service';
import { PhotoService } from '../../projects/shared/src/lib/_services/photo.service';
import { NotificationService } from 'shared';
import { UserLoginInterface } from '../../projects/shared/src/lib/_interfaces/UserLoginInterface';
import { TicketService } from 'src/app/_services/ticket.service';

import { RoomService } from './_services/room.service';
import { UserService } from 'src/app/_services/user.service';

interface AppPage {
  title: string;
  url: string;
  icon: string;
  id: string;
  tourAnchor?: string;
  badge?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonText,
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
    IonMenuToggle,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonButton,
    TourIonPopoverModule,
    IonBadge,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  menuController = inject(MenuController);
  loginService: LoginService = inject(LoginService);
  router = inject(Router);
  toastService = inject(ToastService);
  photoService = inject(PhotoService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  ticketService = inject(TicketService);
  roomService = inject(RoomService);

  user$ = this.loginService.user;

  user!: Observable<UserInterface | null>;

  public appPages: AppPage[] = [
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
      title: 'Chamados',
      url: '/chamados',
      icon: 'contract',
      id: 'button-sidebar-chamados',
      tourAnchor: 'menu.tickets',
      badge: 0,
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: 'chatbubbles',
      id: 'button-sidebar-chat',
      tourAnchor: 'menu.chat',
      badge: 0,
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
      title: 'Logs',
      url: '/atividades',
      icon: 'ear',
      id: 'button-sidebar-logs',
      tourAnchor: 'menu.logs',
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
      contractSharp,
      earSharp,
    });
  }

  incrementBadge(title: string) {
    const page = this.appPages.find((p) => p.title === title);

    if (page) {
      page.badge = (page.badge ?? 0) + 1;
    }
  }

  resetBadge(title: string) {
    const page = this.appPages.find((p) => p.title === title);

    if (page) {
      page.badge = 0;
    }
  }

  listeners = [
    {
      channel: 'tickets',
      event: '.new.ticket',
      callback: (data: any) => {
        this.incrementBadge('Chamados');
        this.ticketService.ticketsSubject.next([
          data,
          ...this.ticketService.ticketsSubject.value,
        ]);
      },
    },
    {
      channel: 'rooms',
      event: '.new.room',
      callback: (data: any) => {
        this.incrementBadge('Chat');
        this.roomService.roomsSubject.next([
          data,
          ...this.roomService.roomsSubject.value,
        ]);
      },
    },
  ];

  ngOnInit() {
    this.getUser();
  }

  verifyDevide() {}

  getUser() {
    this.user$.subscribe((user) => {
      if (user) {
        this.listenPrivateChannels();
      }
    });
  }

  ngOnDestroy() {
    this.logoutPrivateChannels();
  }

  logoutPrivateChannels() {
    this.listeners.forEach(({ channel, event, callback }) => {
      this.notificationService.leave(channel);
    });
  }

  listenPrivateChannels() {
    this.listeners.forEach(({ channel, event, callback }) => {
      this.notificationService.listenPrivate(channel, event, callback);
    });
  }

  hideElementsMenuByTypeUser(user: UserLoginInterface) {
    this.appPages = this.appPages.filter((page) => {
      return page.title !== 'Relatórios' && page.title !== 'Configurações';
    });
  }

  logout() {
    this.loginService.logout().subscribe(() => {
      this.logoutPrivateChannels();
    });
  }

  async takePicture() {
    const picture = await this.photoService.takePicture();

    if (!picture) {
      return;
    }

    this.userService.updateAvatarImage(picture).subscribe();
  }
}
