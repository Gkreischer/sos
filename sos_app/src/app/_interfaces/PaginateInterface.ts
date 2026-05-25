export interface PaginateInterface<T> {
  current_page: number;
  data: T;
  first_page_url: string;
  from: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  last_page_url: string;
  to: number;
  total: number;
  last_page: number;
}
