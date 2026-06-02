import { Component, signal, inject, effect } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  imports: [
    IonText,
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonList,
    AsyncPipe,
    IonItem,
    IonLabel,
    DatePipe,
  ],
})
export class PostsListComponent {
  postService = inject(PostService);
  loadingService = inject(LoadingService);

  posts$ = this.postService.posts$;
  postsPage: number = 1;
  infiniteScroll = signal(true);
  isLoading$ = this.loadingService.isLoading$;

  constructor() {
    effect(() => {
      this.postsPage = 1;
      this.infiniteScroll.set(true);
      this.postService.getAllPosts().subscribe((res) => {
        if (res.current_page >= res.last_page) {
          this.infiniteScroll.set(false);
        }
      });
    });
  }
}
