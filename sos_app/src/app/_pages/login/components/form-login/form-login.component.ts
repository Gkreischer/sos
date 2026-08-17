import {Component,
  OnInit,
  inject,
  ChangeDetectionStrategy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from 'shared';
import { UserLoginInterface } from 'shared';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { LoadingService } from 'shared';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {
  IonCard,
  IonImg,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardTitle,
  IonButton,
  IonInput,
} from '@ionic/angular/standalone';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
  imports: [
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonImg,
    ReactiveFormsModule,
    AsyncPipe,
    IonCard,
    IonInput,
  ],
  standalone: true,
})
export class FormLoginComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  menuController = inject(MenuController);
  loadingService = inject(LoadingService);

  loginForm!: FormGroup;
  loginData: Observable<UserLoginInterface | null> = this.loginService.user;
  isLoading$ = this.loadingService.isLoading$;

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  enableMenu() {
    this.menuController.toggle('main');
  }

  login() {
    this.loginService.login(this.loginForm.value).subscribe((res) => {
      this.loginData = this.loginService.user;
      this.enableMenu();
      // 1. Recupera a URL que o Guard guardou, ou define '/home' como padrão
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

      // 2. Redireciona o usuário para onde ele tentou ir antes do Guard barrar
      this.router.navigateByUrl(returnUrl);
    });
  }
}