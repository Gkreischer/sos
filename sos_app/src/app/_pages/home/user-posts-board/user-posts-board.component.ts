import { Component, OnInit, inject } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { PostService } from 'src/app/_services/post.service';
import { PostInterface } from 'src/app/_interfaces/PostInterface';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'app-user-posts-board',
  templateUrl: './user-posts-board.component.html',
  styleUrls: ['./user-posts-board.component.scss'],
  imports: [
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
  ],
})
export class UserPostsBoardComponent {
  postService = inject(PostService);
  router = inject(Router);
  loadingService = inject(LoadingService);

  lastPosts$: Observable<PostInterface[]> = this.postService.posts$;
  isLoading$ = this.loadingService.isLoading$;

  constructor() {}

  goToPostsPage() {
    this.router.navigate(['/posts']);
  }
}
