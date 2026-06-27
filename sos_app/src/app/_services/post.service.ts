import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, tap, catchError, map } from 'rxjs';
import { PostInterface } from 'src/app/_interfaces/PostInterface';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { PaginateInterface } from 'src/app/_interfaces/PaginateInterface';
import { PostFilterInterface } from 'src/app/_interfaces/PostFilterInterface';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  posts: BehaviorSubject<PostInterface[]> = new BehaviorSubject<
    PostInterface[]
  >([]);

  post: BehaviorSubject<PostInterface | null> =
    new BehaviorSubject<PostInterface | null>(null);

  postFilters = signal<PostFilterInterface | null>(null);

  get posts$() {
    return this.posts.asObservable();
  }

  get post$() {
    return this.post.asObservable();
  }

  constructor() {}

  setPostFilter(postFilter: PostFilterInterface | null) {
    this.postFilters.set(postFilter);
  }

  createPost(post: PostInterface) {
    return this.http
      .post<PostInterface>(`${environment.baseUrl}/posts`, post)
      .pipe(
        tap((res) => {
          this.posts.next([res, ...this.posts.value]);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updatePost(id: number, post: PostInterface) {
    return this.http
      .put<PostInterface>(`${environment.baseUrl}/posts/${id}`, post)
      .pipe(
        map((updatedPost) => {
          const currentPosts = this.posts.value;

          const posts = currentPosts.map((p) =>
            p.id === updatedPost.id ? updatedPost : p,
          );

          this.posts.next(posts);
          this.post.next(updatedPost);
        }),
        catchError(this.errorService.handleError),
      );
  }

  deletePost(post: PostInterface) {
    return this.http
      .delete<any>(`${environment.baseUrl}/posts/${post.id}`)
      .pipe(
        tap((res) => {
          this.post.next(null);
          this.posts.next(
            this.posts.value.filter((post) => res.id !== post.id),
          );
        }),
        catchError(this.errorService.handleError),
      );
  }

  getLastPosts() {
    return this.http
      .get<PostInterface[]>(`${environment.baseUrl}/posts/last`)
      .pipe(
        tap((res) => {
          this.posts.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getPosts(pageNumber: number, filters?: PostFilterInterface | null) {
    return this.http
      .post<
        PaginateInterface<PostInterface[]>
      >(`${environment.baseUrl}/posts/filter${filters ? `?page=${pageNumber}` : ''}`, this.postFilters())
      .pipe(
        tap((res) => {
          this.posts.next(res.data);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getPost(id: number) {
    return this.http
      .get<PostInterface>(`${environment.baseUrl}/posts/${id}`)
      .pipe(
        tap((res) => {
          this.post.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
