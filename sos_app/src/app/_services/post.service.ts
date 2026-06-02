import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, tap, catchError, map } from 'rxjs';
import { PostInterface } from 'src/app/_interfaces/PostInterface';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { PaginateInterface } from 'src/app/_interfaces/PaginateInterface';
import { PartFilterInterface } from 'src/app/_interfaces/PartFilterInterface';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);

  posts: BehaviorSubject<PostInterface[]> = new BehaviorSubject<
    PostInterface[]
  >([]);

  partFilters = signal<PartFilterInterface | null>(null);

  get posts$() {
    return this.posts.asObservable();
  }

  constructor() {}

  setPostFilter(partFilter: PartFilterInterface | null) {
    this.partFilters.set(partFilter);
  }

  getPosts(user: string) {
    return this.http
      .get<any>(`${environment.baseUrl}/users/${user}/posts`)
      .pipe(
        tap((res) => {
          this.posts.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  createPost(user: string, post: PostInterface) {
    return this.http
      .post<any>(`${environment.baseUrl}/users/${user}/posts`, post)
      .pipe(
        tap((res) => {
          this.posts.next(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  updatePost(user: string, post: PostInterface) {
    return this.http
      .put<any>(`${environment.baseUrl}/users/${user}/posts/${post.id}`, post)
      .pipe(
        map((updatedPost) => {
          const currentPosts = this.posts.value;

          const posts = currentPosts.map((p) =>
            p.id === updatedPost.id ? updatedPost : p,
          );

          this.posts.next(posts);

          return updatedPost;
        }),
        catchError(this.errorService.handleError),
      );
  }

  deletePost(user: string, post: PostInterface) {
    return this.http
      .delete<any>(`${environment.baseUrl}/users/${user}/posts/${post.id}`)
      .pipe(
        tap((res) => {
          this.posts.next(res);
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
          console.log(res);
        }),
        catchError(this.errorService.handleError),
      );
  }

  getAllPosts() {
    return this.http
      .get<PaginateInterface<PostInterface[]>>(`${environment.baseUrl}/posts`)
      .pipe(
        tap((res) => {
          this.posts.next(res.data);
        }),
        catchError(this.errorService.handleError),
      );
  }
}
