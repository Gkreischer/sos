import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have categoriesSubject as a BehaviorSubject', () => {
    expect(service.categoriesSubject).toBeTruthy();
    expect(service.categoriesSubject).toBeInstanceOf(BehaviorSubject);
  });

  it('should have a getCategories method', () => {
    expect(service.getCategories).toBeTruthy();
  });

  it('should have a addCategory method', () => {
    expect(service.addCategory).toBeTruthy();
  });

  it('should have a updateCategory method', () => {
    expect(service.updateCategory).toBeTruthy();
  });

  it('should have a deleteCategory method', () => {
    expect(service.deleteCategory).toBeTruthy();
  });

  it('should have load categories from getCategories method', async () => {
    const categories = [
      {
        id: 1,
        name: 'Category 1',
        description: 'Category 1 description',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const categories$ = service.getCategories();

    const categoriesPromisse = firstValueFrom(categories$);

    const req = httpTesting.expectOne((req) => {
      return req.url.endsWith('/categories');
    });

    expect(req.request.method).toBe('GET');

    req.flush(categories);

    const result = await categoriesPromisse;
    expect(result).toEqual(categories);
  });

  it('should have add category from addCategory method', async () => {
    const category = {
      id: 1,
      name: 'Category 1',
      description: 'Category 1 description',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const category$ = service.addCategory(category);

    const categoryPromisse = firstValueFrom(category$);

    const req = httpTesting.expectOne((req) => {
      return req.url.endsWith('/categories') && req.method === 'POST';
    });

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(category);

    req.flush(category);

    const result = await categoryPromisse;
    expect(result).toEqual(category);
  });

  it('should have update category from updateCategory method', async () => {
    const category = {
      id: 1,
      name: 'Category 1',
      description: 'Category 1 description',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const category$ = service.updateCategory(category, 1);

    const categoryPromisse = firstValueFrom(category$);

    const req = httpTesting.expectOne((req) => {
      return req.url.endsWith('/categories/1') && req.method === 'PUT';
    });

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(category);

    req.flush(category);

    const result = await categoryPromisse;
    expect(result).toEqual(category);
  });

  it('should have delete category from deleteCategory method', async () => {
    const category = {
      id: 1,
      name: 'Category 1',
      description: 'Category 1 description',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const category$ = service.deleteCategory(category);

    const categoryPromisse = firstValueFrom(category$);

    const req = httpTesting.expectOne((req) => {
      return req.url.endsWith('/categories/1') && req.method === 'DELETE';
    });

    expect(req.request.method).toBe('DELETE');

    req.flush(category);

    const result = await categoryPromisse;
    expect(result).toEqual(category);
  });
});
