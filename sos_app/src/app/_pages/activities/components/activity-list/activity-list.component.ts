import { Component, OnInit, inject } from '@angular/core';
import { ActivityService } from 'src/app/_services/activity.service';
import { ActivityInterface } from 'src/app/_interfaces/ActivityInterface';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-activity-list',
  imports: [],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss',
})
export class ActivityListComponent implements OnInit {
  activityService = inject(ActivityService);

  activities: Observable<ActivityInterface[]> = this.activityService.activities;

  ngOnInit() {
    this.getActivities();
  }

  getActivities() {
    this.activityService.getActivities().subscribe((res) => console.log(res));
  }
}
