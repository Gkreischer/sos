import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from 'src/app/_services/login.service';
import { UserLoginInterface } from 'src/app/_interfaces/UserLoginInterface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController, IonicModule } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, AsyncPipe],
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
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  enableMenu() {
    this.menuController.toggle('main');
  }

  login() {
    this.loginService.login(this.loginForm.value).subscribe((res) => {
      console.log(res);
      this.loginData = this.loginService.user;
      this.enableMenu();
      // 1. Recupera a URL que o Guard guardou, ou define '/home' como padrão
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

      // 2. Redireciona o usuário para onde ele tentou ir antes do Guard barrar
      this.router.navigateByUrl(returnUrl);
    });
  }
}
