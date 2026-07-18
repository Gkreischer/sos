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
import { LastPostsBoardComponent } from './last-posts-board/last-posts-board.component';
import { MenuController } from '@ionic/angular';
import { inject } from '@angular/core';
import { PostService } from 'src/app/_services/post.service';
import { ViewWillEnter, ViewDidEnter } from '@ionic/angular';
import { TourService } from 'ngx-ui-tour-ionic';
import tourSteps from 'src/app/_shared/utils/tour/tour';
import { PreferencesPluginService } from 'src/app/_services/preferences-plugin.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { OrdersPedingCountCardComponent } from './component/orders-peding-count-card/orders-peding-count-card.component';
import { OrdersInprogressCountCardComponent } from './component/orders-inprogress-count-card/orders-inprogress-count-card.component';
import { TotalClientsCountCardComponent } from './component/total-clients-count-card/total-clients-count-card.component';
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
    LastPostsBoardComponent,
    IonGrid,
    IonRow,
    IonCol,
    OrdersPedingCountCardComponent,
    OrdersInprogressCountCardComponent,
    TotalClientsCountCardComponent,
  ],
})
export class HomePage implements ViewWillEnter, ViewDidEnter {
  menuController = inject(MenuController);
  postService = inject(PostService);
  tourService = inject(TourService);
  preferenceService = inject(PreferencesPluginService);
  notificationService = inject(NotificationService);
  constructor() {}

  ionViewWillEnter() {
    this.postService.getLastPosts().subscribe();
    this.menuController.enable(true, 'main');
  }

  ionViewDidEnter() {
    this.startTour();
  }

  async startTour() {
    if ((window as any).Cypress) {
      return;
    }

    const intro = await this.preferenceService.get('intro');

    if (intro.value) {
      return false;
    }

    this.tourService.initialize(tourSteps);
    this.tourService.start();
    this.menuController.open('main');

    await this.tutorialIsViewed();

    return true;
  }

  async tutorialIsViewed() {
    await this.preferenceService.set('intro', 'true');
  }
}
