import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonRow,
  IonGrid,
  IonCol,
  IonButton,
  IonInput,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { LoginService } from 'src/app/_services/login.service';
import { UserLoginInterface } from 'src/app/_interfaces/UserLoginInterface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonCardTitle,
    IonCardHeader,
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonCardContent,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonInput,
  ],
})
export class LoginPage implements OnInit {
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  menuController = inject(MenuController);
  loadingService = inject(LoadingService);

  form!: FormGroup;
  loginData: Observable<UserLoginInterface | null> = this.loginService.user;
  isLoading$ = this.loadingService.isLoading$;

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    this.loginService.login(this.form.value).subscribe((res) => {
      this.loginData = this.loginService.user;
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
      this.router.navigateByUrl(returnUrl);
    });
  }
}
