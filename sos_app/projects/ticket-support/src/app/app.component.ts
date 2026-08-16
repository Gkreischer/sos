import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, person, contract, exit, hardwareChip } from 'ionicons/icons';
import { LoginService } from 'shared';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { NotificationService } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      hardwareChip,
    });
  }
}
