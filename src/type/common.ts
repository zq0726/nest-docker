export interface PaginationMeta {
  page: number;
  total: number;
  pageSize: number;
}

// 分页数据
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页返回的结构
export interface PaginationResult<T> extends PaginationMeta {
  data: T[];
}
