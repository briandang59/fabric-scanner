export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
