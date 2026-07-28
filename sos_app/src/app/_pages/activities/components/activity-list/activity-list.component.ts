import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivityService } from 'src/app/_services/activity.service';
import { ActivityInterface } from 'src/app/_interfaces/ActivityInterface';
import { Observable } from 'rxjs';
import {
  IonCardContent,
  IonCard,
  IonLabel,
  IonIcon,
  IonCardHeader,
  IonText,
  IonChip,
  IonRow,
  IonGrid,
  IonCol,
  IonList,
  IonItem,
  IonListHeader,
  IonNote,
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  listCircleOutline,
  gridOutline,
  timeOutline,
  peopleOutline,
  globeOutline,
  browsersOutline,
  codeWorkingOutline,
} from 'ionicons/icons';
import { LoadingService } from 'shared';
import { InfiniteScrollCustomEvent } from '@ionic/core';
@Component({
  selector: 'app-activity-list',
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonAccordionGroup,
    IonAccordion,
    IonNote,
    IonListHeader,
    IonItem,
    IonList,
    IonText,
    IonCardHeader,
    IonIcon,
    IonLabel,
    IonCard,
    IonCardContent,
    AsyncPipe,
    DatePipe,
    JsonPipe,
    IonSpinner,
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
})
export class ActivityListComponent implements OnInit {
  activityService = inject(ActivityService);
  loadingService = inject(LoadingService);

  activities$: Observable<ActivityInterface[]> =
    this.activityService.activities;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;
  infiniteScroll = signal(true);

  ticketsPage = 1;

  constructor() {
    addIcons({
      listCircleOutline,
      gridOutline,
      timeOutline,
      peopleOutline,
      globeOutline,
      browsersOutline,
      codeWorkingOutline,
    });
  }

  ngOnInit() {
    this.getActivities();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.ticketsPage++;

    this.activityService.getActivities(this.ticketsPage).subscribe({
      next: (res) => {
        if (res.current_page >= res.last_page) {
          event.target.disabled = true;
        }

        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  getActivities() {
    this.ticketsPage = 1;
    this.infiniteScroll.set(true);

    this.activityService.getActivities(this.ticketsPage).subscribe((res) => {
      if (res.current_page >= res.last_page) {
        this.infiniteScroll.set(false);
      }
    });
  }
}
