import { Component, OnInit, inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, person, contract } from 'ionicons/icons';
import { LoginService } from './_services/login.service';
import { AsyncPipe } from '@angular/common';

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
  ],
})
export class AppComponent implements OnInit {
  loginService = inject(LoginService);

  user$ = this.loginService.user;

  constructor() {
    addIcons({
      home,
      person,
      contract,
    });
  }

  ngOnInit() {}
}
