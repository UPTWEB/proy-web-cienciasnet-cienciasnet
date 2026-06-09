export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ResourceResponse<T> {
  data: T
  message?: string
}
