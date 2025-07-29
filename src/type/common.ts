export interface PaginationMeta {
  page: number;
  total: number;
  size: number;
}

// 分页数据
export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// 分页返回的结构
export interface PaginationResult<T> extends PaginationMeta {
  data: T[];
}
