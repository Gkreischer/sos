import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { LoginService } from 'src/app/_services/login.service';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonGrid, IonRow, IonCol, FormLoginComponent],
})
export class LoginPage implements OnInit {
  loginService = inject(LoginService);
  router = inject(Router);
  user$: Observable<UserInterface | null> = this.loginService.user;

  constructor() {}

  ngOnInit() {
    this.verifyIfIsLogged();
  }

  verifyIfIsLogged() {
    this.user$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/home']);
      }
    });
  }
}
