export interface PaginatedResponse<T> {
  data: T[]
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export interface ResourceResponse<T> {
  data: T
  message?: string
}
