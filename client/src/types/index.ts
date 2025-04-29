export type HttpResponse<T> = {
  message: string;
  data: T;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type PaginatedResponse<T> = {
  message: string;
  data: T[];
  pagination: Pagination;
};
