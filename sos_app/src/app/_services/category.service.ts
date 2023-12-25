import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../_models/Category';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';

const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoriesSubject = new BehaviorSubject<Category[]>([]);

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  get categories() {
    return this.categoriesSubject.asObservable();
  }

  getCategories() {
    return this.http
      .get<Category[]>(`${environment.baseUrl}/categories`, {
        headers: httpHeaders,
      })
      .pipe(
        tap((categories) => {
          return this.categoriesSubject.next(categories);
        }),
        catchError(this.errorService.handleError)
      );
  }
}
