import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { PostFilterComponent } from './components/post-filter/post-filter.component';
import { IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { PostService } from 'src/app/_services/post.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    PostsListComponent,
    PostFilterComponent,
    IonButtons,
    IonMenuButton,
  ],
})
export class PostsPage implements ViewWillEnter {
  postService = inject(PostService);
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.postService.getPosts(1).subscribe();
  }
}
