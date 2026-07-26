import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { LoadingService } from 'shared';
import { addIcons } from 'ionicons';
import { trash, arrowBack } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { UserService } from 'src/app/_services/user.service';
import { ToastService } from 'src/app/_services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { LoginService } from 'shared';
@Component({
  selector: 'app-user-password-modal',
  standalone: true,
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.css',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    AsyncPipe,
    ReactiveFormsModule,
  ],
})
export class UserPasswordModalComponent implements OnInit {
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  loadingService = inject(LoadingService);
  userService = inject(UserService);
  alertService = inject(AlertService);
  toastService = inject(ToastService);
  loginService = inject(LoginService);
  user!: UserInterface;

  isLoading$ = this.loadingService.isLoading$;

  form!: FormGroup;

  constructor() {
    addIcons({ trash, arrowBack });
  }

  ngOnInit() {
    this.mountForm();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  mountForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  get password() {
    return this.form.get('password')?.value;
  }

  get passwordConfirmation() {
    return this.form.get('password_confirmation')?.value;
  }

  submit() {
    if (this.password !== this.passwordConfirmation) {
      this.form.get('password_confirmation')?.setErrors({
        mismatch: true,
        emitEvent: false,
      });
      this.form.reset();
      this.toastService.presentToast(
        'Senha não é igual a sua confirmação',
        'bottom',
        4000,
        'danger',
      );
      return;
    }
    this.loginService.updateUserPassword(this.form.value).subscribe({
      next: () => {
        this.closeModal();
        this.toastService.presentToast(
          'Senha atualizada com sucesso',
          'bottom',
          4000,
          'success',
        );
      },
    });
  }
}
