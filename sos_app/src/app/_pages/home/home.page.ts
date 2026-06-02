import { Component } from '@angular/core';

import {
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { UserPostsBoardComponent } from './user-posts-board/user-posts-board.component';
import { MenuController } from '@ionic/angular';
import { inject } from '@angular/core';
import { PostService } from 'src/app/_services/post.service';
import { ViewWillEnter } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonToolbar,
    UserPostsBoardComponent,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class HomePage implements ViewWillEnter {
  menuController = inject(MenuController);
  postService = inject(PostService);
  constructor() {}

  ionViewWillEnter() {
    this.postService.getLastPosts().subscribe();
    this.menuController.enable(true, 'main');
  }
}
