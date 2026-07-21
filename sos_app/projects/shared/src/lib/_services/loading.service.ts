import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requests = 0;

  private loadingSubject = new BehaviorSubject<number>(0);

  isLoading$ = this.loadingSubject.pipe(map((value) => value > 0));

  show() {
    this.requests++;
    this.loadingSubject.next(this.requests);
  }

  hide() {
    this.requests = Math.max(0, this.requests - 1);
    this.loadingSubject.next(this.requests);
  }
}
