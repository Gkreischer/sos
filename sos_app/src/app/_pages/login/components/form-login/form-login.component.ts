import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/_services/login.service';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController, IonicModule } from '@ionic/angular';
@Component({
    selector: 'app-form-login',
    templateUrl: './form-login.component.html',
    styleUrls: ['./form-login.component.scss'],
    imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class FormLoginComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  router = inject(Router);
  menuController = inject(MenuController);
  loginForm!: FormGroup;

  loginData: Observable<UserInterface | null> = this.loginService.user;

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
    this.menuController.enable(true, 'main');
  }

  login() {
    this.loginService.login(this.loginForm.value).subscribe((res) => {
      console.log(res);
      this.loginData = this.loginService.user;
      this.enableMenu();
      this.router.navigate(['/home']);
    });
  }
}
