import {Component, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonText,
  IonRow,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { PostService } from 'src/app/_services/post.service';
import { PostInterface } from 'shared';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PostContentModalComponent } from '../../posts/components/post-content/post-content.component';
import { TourAnchorIonPopoverDirective } from 'ngx-ui-tour-ionic';
import { addIcons } from 'ionicons';
import { library } from 'ionicons/icons';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-posts-board',
  templateUrl: './last-posts-board.component.html',
  styleUrls: ['./last-posts-board.component.scss'],
  imports: [
    IonIcon,
    IonSpinner,
    IonButton,
    IonText,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonList,
    AsyncPipe,
    IonItem,
    IonLabel,
    DatePipe,
    TourAnchorIonPopoverDirective,
  ],
})
export class LastPostsBoardComponent {
  postService = inject(PostService);
  router = inject(Router);
  loadingService = inject(LoadingService);
  modalService = inject(ModalService);

  lastPosts$: Observable<PostInterface[]> = this.postService.posts$;
  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    addIcons({ library });
  }

  goToPostsPage() {
    this.router.navigate(['/posts']);
  }

  openModalPost(post: PostInterface) {
    this.modalService.openModal(PostContentModalComponent, { post: post });
  }
}
