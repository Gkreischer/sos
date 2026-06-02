import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryInterface } from '../_interfaces/CategoryInterface';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';

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

  addCategory(category: CategoryInterface) {
    return this.http
      .post<CategoryInterface>(
        `${environment.baseUrl}/categories`,
        category,
        httpOptions,
      )
      .pipe(
        tap((category) => {
          return this.categoriesSubject.next([
            category,
            ...this.categoriesSubject.value,
          ]);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updateCategory(category: CategoryInterface, id: number) {
    return this.http
      .put<CategoryInterface>(
        `${environment.baseUrl}/categories/${id}`,
        category,
        httpOptions,
      )
      .pipe(
        tap((categoryReceived) => {
          const newCategories = this.categoriesSubject.value.map((category) => {
            if (category.id === categoryReceived.id) {
              return categoryReceived;
            }
            return category;
          });
          return this.categoriesSubject.next(newCategories);
        }),
        catchError(this.errorService.handleError),
      );
  }

  deleteCategory(category: CategoryInterface) {
    return this.http
      .delete(`${environment.baseUrl}/categories/${category.id}`, httpOptions)
      .pipe(
        tap(() => {
          const newCategories = this.categoriesSubject.value.filter(
            (categoryListItem) => categoryListItem.id !== category.id,
          );
          this.categoriesSubject.next(newCategories);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
