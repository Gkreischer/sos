import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonInput,
  IonToggle,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonText,
  IonNote,
  IonModal,
  IonAvatar,
  IonImg,
  IonChip,
} from '@ionic/angular/standalone';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RoomService } from 'src/app/_services/room.service';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { RoomInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToastService } from 'src/app/_services/toast.service';
import { LoadingService } from 'shared';
import { UserInterface } from 'shared';
import { FormArray } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { IonSpinner } from '@ionic/angular/standalone';
import { LoginService } from 'shared';
import { addIcons } from 'ionicons';
import {
  saveOutline,
  closeSharp,
  searchCircle,
  pencilSharp,
  close,
  arrowBack,
  trash,
} from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-room-modal',
  templateUrl: './room-modal.component.html',
  styleUrls: ['./room-modal.component.scss'],
  imports: [
    IonChip,
    IonImg,
    IonAvatar,
    IonModal,
    IonText,
    IonItem,
    IonList,
    IonToggle,
    IonInput,
    IonFabButton,
    IonFab,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCard,
    IonContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    ReactiveFormsModule,
    AsyncPipe,
    IonSearchbar,
    IonLabel,
    IonSpinner,
    IonNote,
  ],
})
export class RoomModalComponent implements OnInit {
  modalService = inject(ModalService);
  roomService = inject(RoomService);
  alertService = inject(AlertService);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  loadingService = inject(LoadingService);
  userService = inject(UserService);
  loginService = inject(LoginService);

  isModalOpen = false;

  userLogged$: Observable<UserInterface | null> = this.loginService.user;
  room$: Observable<RoomInterface | null> = this.roomService.room;
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;
  usersSearched$: Observable<UserInterface[] | null> = this.userService.users;

  roomId!: number;

  roomForm!: FormGroup;

  constructor() {
    addIcons({
      saveOutline,
      closeSharp,
      searchCircle,
      pencilSharp,
      close,
      arrowBack,
      trash,
    });
  }

  ngOnInit() {
    this.mountForm();
    if (this.roomId) {
      this.getRoomInfo();
    }
  }

  mountForm() {
    this.roomForm = this.formBuilder.group({
      name: ['', Validators.required],
      private: [false, [Validators.required]],
      users: this.formBuilder.array([]),
    });

    this.roomForm.get('private')?.valueChanges.subscribe((value) => {
      if (!value) {
        const usersFormArray = this.roomForm.get('users') as FormArray;
        usersFormArray.clear();
        this.isModalOpen = false; // Fecha o modal se o toggle for desativado
      }
    });
  }

  onTogglePrivate(event: any) {
    const isChecked = event.detail.checked;

    // Só abre o modal se ele estiver ativando o toggle para "true"
    if (isChecked) {
      this.isModalOpen = true;
    }
  }

  get users() {
    return this.roomForm.get('users') as FormArray;
  }

  get roomIsPrivate() {
    const privateValue = this.roomForm.get('private')?.value;
    if (!privateValue) {
      return false;
    }
    return privateValue;
  }

  addUserInRoom(user: UserInterface) {
    this.users.push(this.formBuilder.control(user, Validators.required));
  }

  removeUserInRoom(user: UserInterface) {
    this.users.removeAt(
      this.users.controls.findIndex((control) => control.value.id === user.id),
    );
  }

  disableUserAlreadyAdded(user: UserInterface): boolean {
    if (this.users.value.length === 0) {
      return false;
    }
    return (
      this.roomForm
        .get('users')
        ?.value?.some(
          (userSearched: UserInterface) => userSearched.id === user.id,
        ) ?? false
    );
  }

  getRoomInfo() {
    this.roomService.getRoom(this.roomId).subscribe((res: any) => {
      // 1. Popula os campos simples (name e private)
      this.roomForm.patchValue(res);

      // 2. Limpa o FormArray atual antes de popular (garantia antiduplicação)
      const usersFormArray = this.roomForm.get('users') as FormArray;
      usersFormArray.clear();

      // 3. Verifica se a resposta contém usuários e popula o FormArray
      if (res.users && Array.isArray(res.users)) {
        res.users.forEach((user: any) => {
          // Cria um controle (ou grupo) para cada usuário da lista
          usersFormArray.push(
            this.formBuilder.group({
              id: [user.id],
              name: [user.name],
            }),
          );
        });
      }
    });
  }

  closeModal() {
    this.modalService.closeModal();
    this.roomService.roomSubject.next(null);
    this.userService.usersSubject.next(null);
  }

  async confirmDeleteRoom() {
    const result = await this.alertService.presentAlert(
      'Confirmação',
      'Tem certeza que deseja deletar essa sala?',
      'warning',
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.delete();
            this.closeModal();
          },
          role: 'destructive',
          cssClass: 'primary',
        },
      ],
    );
  }

  delete() {
    this.roomService.delete(this.roomId).subscribe();
  }

  update() {
    const room = this.roomForm.value;
    this.roomService.update(this.roomId, room).subscribe((res) => {
      this.toastService.presentToast(
        'Sala atualizada com sucesso',
        'bottom',
        4000,
        'success',
      );
      this.closeModal();
    });
  }

  submit() {
    const room = this.roomForm.value;
    this.roomService.create(room).subscribe((res) => {
      this.toastService.presentToast(
        'Sala criada com sucesso',
        'bottom',
        4000,
        'success',
      );
      this.closeModal();
    });
  }

  searchUser(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';

    this.userService.getUserByDesc({ description: query }).subscribe();
  }
}
