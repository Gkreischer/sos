import { Component, OnInit } from '@angular/core';
import { PostInterface } from 'src/app/_interfaces/PostInterface';
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
  IonCardSubtitle,
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
import { ModalService } from 'src/app/_services/modal.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/_services/login.service';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostService } from 'src/app/_services/post.service';
import { AlertService } from 'src/app/_services/alert.service';
import { PostModalAddEditComponent } from '../post-modal-add-edit/post-modal-add-edit.component';
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
export class PostContentModalComponent implements OnInit {
  modalService = inject(ModalService);
  loginService = inject(LoginService);
  postService = inject(PostService);
  alertService = inject(AlertService);

  post!: PostInterface;
  user$: Observable<UserInterface | null> = this.loginService.user;

  constructor() {}

  ngOnInit() {
    console.log(this.post);
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
    this.postService.deletePost(post).subscribe();
  }

  openModalEdit(post: PostInterface) {
    this.modalService.openModal(PostModalAddEditComponent, { postId: post.id });
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
