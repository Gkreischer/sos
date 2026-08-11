import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { UserInterface } from 'shared';
import { PaginateInterface } from 'shared';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const mockUsers = [{ id: 1, name: 'John Doe' } as UserInterface];
    const mockResponse: PaginateInterface<UserInterface[]> = {
      data: mockUsers,
      current_page: 1,
      first_page_url: '',
      from: 1,
      last_page: 1,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 10,
      prev_page_url: '',
      total: 1,
      to: 1,
    };

    service.getUsers().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should add a user', () => {
    const mockUser = { id: 1, name: 'John Doe' } as UserInterface;
    const mockResponse = { id: 1, name: 'John Doe' } as UserInterface;

    service.addUser(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/users/add`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a user', () => {
    const mockUser = { id: 1, name: 'John Doe' } as UserInterface;
    const mockResponse = { id: 1, name: 'John Doe Updated' } as UserInterface;

    service.updateUser(mockUser, 1).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/users/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a user', () => {
    const mockUser = { id: 1, name: 'John Doe' } as UserInterface;
    const mockResponse = { id: 1, name: 'John Doe' } as UserInterface;

    service.deleteUser(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
