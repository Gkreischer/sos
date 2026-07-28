import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from 'shared';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap, debounceTime } from 'rxjs';
import { ActivityInterface } from 'src/app/_interfaces/ActivityInterface';
import { PaginateInterface } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  activitiesSubject = new BehaviorSubject<ActivityInterface[]>([]);

  activitySubject = new BehaviorSubject<ActivityInterface | null>(null);

  activityFilter = signal<ActivityInterface | null>(null);

  constructor() {}

  get activities() {
    return this.activitiesSubject.asObservable();
  }

  getActivities(page: number = 1) {
    return this.http
      .get<
        PaginateInterface<ActivityInterface[]>
      >(`${environment.baseUrl}/activities${page ? `?page=${page}` : ''}`)
      .pipe(
        tap((res) => {
          if (res.current_page === 1) {
            this.activitiesSubject.next(res.data);
          } else {
            this.activitiesSubject.next([
              ...this.activitiesSubject.getValue(),
              ...res.data,
            ]);
          }
        }),
        catchError(this.errorService.handleError),
      );
  }
}
