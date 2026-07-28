import { Component, OnInit } from '@angular/core';
import { PostInterface } from 'shared';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonChip,
  IonText,
  IonFab,
  IonFabButton,
  IonFabList,
  IonRow,
  IonCol,
  IonGrid,
  IonTextarea,
  IonAvatar,
  IonLabel,
} from '@ionic/angular/standalone';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoginService } from 'shared';
import { UserInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostService } from 'src/app/_services/post.service';
import { AlertService } from 'projects/shared/src/lib/_services/alert.service';
import { PostModalAddEditComponent } from '../post-modal-add-edit/post-modal-add-edit.component';
import { ToastService } from 'src/app/_services/toast.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss'],
  imports: [
    IonLabel,
    IonAvatar,
    IonTextarea,
    IonGrid,
    IonCol,
    IonRow,
    IonFabList,
    IonFabButton,
    IonFab,
    IonText,
    IonChip,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonContent,
    IonIcon,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonCardTitle,
    DatePipe,
    AsyncPipe,
  ],
})
export class PostContentModalComponent {
  modalService = inject(ModalService);
  loginService = inject(LoginService);
  postService = inject(PostService);
  alertService = inject(AlertService);
  toastService = inject(ToastService);

  post!: PostInterface;
  user$: Observable<UserInterface | null> = this.loginService.user;

  constructor() {
    addIcons({ arrowBack });
  }

  confirmDelete() {
    this.alertService.presentAlert(
      'Atenção!',
      'Você tem certeza que deseja deletar este post?',
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
            this.delete(this.post);
          },
        },
      ],
    );
  }

  delete(post: PostInterface) {
    this.postService.deletePost(post).subscribe({
      next: (res) => {
        this.toastService.presentToast(
          'Aviso deletado com sucesso',
          'top',
          5000,
          'success',
        );
        this.closeModal();
      },
    });
  }

  async openModalEdit(post: PostInterface) {
    const postUpdated = await this.modalService.openModal(
      PostModalAddEditComponent,
      {
        postId: post.id,
      },
    );
    if (postUpdated) {
      this.post = postUpdated;
      this.closeModal();
    }
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
