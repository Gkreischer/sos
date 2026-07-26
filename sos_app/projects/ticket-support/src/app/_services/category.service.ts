import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryInterface } from 'shared';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from 'shared';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  categoriesSubject = new BehaviorSubject<CategoryInterface[]>([]);

  constructor() {}

  get categories() {
    return this.categoriesSubject.asObservable();
  }

  getCategories() {
    return this.http
      .get<
        CategoryInterface[]
      >(`${environment.baseUrl}/categories`, httpOptions)
      .pipe(
        tap((categories) => {
          return this.categoriesSubject.next(categories);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
