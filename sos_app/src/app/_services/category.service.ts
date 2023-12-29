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

  addCategory(category: Category) {
    return this.http
      .post<Category>(`${environment.baseUrl}/categories`, category, {
        headers: httpHeaders,
      })
      .pipe(
        tap((category) => {
          return this.categoriesSubject.next([
            ...this.categoriesSubject.value,
            category,
          ]);
        }),
        catchError(this.errorService.handleError)
      );
  }

  updateCategory(category: Category) {
    return this.http
      .put<Category>(
        `${environment.baseUrl}/categories/${category.id}`,
        category,
        {
          headers: httpHeaders,
        }
      )
      .pipe(
        tap((updatedCategory) => {
          const newCategories = this.categoriesSubject.value.map((category) => {
            if (category.id === updatedCategory.id) {
              return updatedCategory;
            }
            return category;
          });
          return this.categoriesSubject.next(newCategories);
        }),
        catchError(this.errorService.handleError)
      );
  }

  deleteCategory(category: Category) {
    return this.http
      .delete(`${environment.baseUrl}/categories/${category.id}`, {
        headers: httpHeaders,
      })
      .pipe(
        tap(() => {
          const newCategories = this.categoriesSubject.value.filter(
            (categoryListItem) => categoryListItem.id !== category.id
          );
          this.categoriesSubject.next(newCategories);
        }),
        catchError(this.errorService.handleError)
      );
  }
}
