import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import type { Animation } from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { LoginService } from 'src/app/_services/login.service';
import { UserLoginInterface } from 'src/app/_interfaces/UserLoginInterface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { LoadingService } from 'src/app/_services/loading.service';
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
export class FormLoginComponent implements OnInit, AfterViewInit {
  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  menuController = inject(MenuController);
  loadingService = inject(LoadingService);
  animationController = inject(AnimationController);

  loginForm!: FormGroup;
  loginData: Observable<UserLoginInterface | null> = this.loginService.user;
  isLoading$ = this.loadingService.isLoading$;

  private animation!: Animation;
  @ViewChild(IonCard, { read: ElementRef })
  card!: ElementRef<HTMLIonCardElement>;

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  ngAfterViewInit() {
    this.fadeInCardAnimation();
  }

  fadeInCardAnimation() {
    this.animation = this.animationController
      .create()
      .addElement(this.card.nativeElement)
      .duration(1000)
      .fromTo('transform', 'translateX(-50px)', 'translateX(0)')
      .fromTo('opacity', '0', '1');

    this.animation.play();
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
