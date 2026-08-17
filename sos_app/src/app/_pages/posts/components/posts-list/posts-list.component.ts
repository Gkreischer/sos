import {Component, signal, inject, effect, ChangeDetectionStrategy} from '@angular/core';
import { PostService } from 'src/app/_services/post.service';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonNote,
  IonChip,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'shared';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { PostContentModalComponent } from '../post-content/post-content.component';
import { PostInterface } from 'shared';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  imports: [
    IonSpinner,
    IonChip,
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonList,
    AsyncPipe,
    IonItem,
    IonLabel,
    DatePipe,
    IonText,
  ],
})
export class PostsListComponent {
  postService = inject(PostService);
  loadingService = inject(LoadingService);
  modalService = inject(ModalService);
  loading$ = this.loadingService.isLoading$;
  posts$ = this.postService.posts$;
  postsPage: number = 1;
  infiniteScroll = signal(true);
  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    effect(() => {
      let filters = this.postService.postFilters();
      this.postsPage = 1;
      this.infiniteScroll.set(true);
      this.postService.getPosts(this.postsPage, filters).subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
    });
  }

  openModalPost(post: PostInterface) {
    this.modalService.openModal(PostContentModalComponent, { post: post });
  }
}
