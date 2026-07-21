import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginService } from 'shared';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    WelcomeComponent,
  ],
})
export class HomePage {
  loginService = inject(LoginService);

  constructor() {}

  logout() {
    this.loginService.logout();
  }
}
