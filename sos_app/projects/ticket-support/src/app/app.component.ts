import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, person, contract, exit } from 'ionicons/icons';
import { LoginService } from '../../../shared/src/lib/_services/login.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { take } from 'rxjs';
import { UserInterface } from '../../../shared/src/lib/_interfaces/UserInterface';
import { NotificationService } from 'shared';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    IonIcon,
    IonTabButton,
    IonTabBar,
    IonTabs,
    IonRouterOutlet,
    IonApp,
    AsyncPipe,
    JsonPipe,
  ],
})
export class AppComponent {
  loginService = inject(LoginService);
  notificationService = inject(NotificationService);

  user$ = this.loginService.user;

  constructor() {
    addIcons({
      home,
      person,
      contract,
      exit,
    });
  }
}
