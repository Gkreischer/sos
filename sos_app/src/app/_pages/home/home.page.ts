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
import { ViewWillEnter, ViewDidEnter } from '@ionic/angular';
import { TourService } from 'ngx-ui-tour-ionic';
import tourSteps from 'src/app/_shared/utils/tour/tour';
import { PreferencesPluginService } from 'src/app/_services/preferences-plugin.service';
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
export class HomePage implements ViewWillEnter, ViewDidEnter {
  menuController = inject(MenuController);
  postService = inject(PostService);
  tourService = inject(TourService);
  preferenceService = inject(PreferencesPluginService);
  constructor() {}

  ionViewWillEnter() {
    this.postService.getLastPosts().subscribe();
    this.menuController.enable(true, 'main');
  }

  ionViewDidEnter() {
    this.startTour();
  }

  async startTour() {
    if (await this.preferenceService.get('intro')) {
      return false;
    }
    this.tourService.initialize(tourSteps);
    this.tourService.start();
    this.tutorialIsViewed();
    return true;
  }

  async tutorialIsViewed() {
    await this.preferenceService.set('intro', 'true');
  }
}
