export interface PaginatedQueryDto {
  page: number
  pageSize: number
  search?: string
  orderBy?: string
  orderDir?: string
}

export interface PaginatedResponseDto<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  orderBy: string
  orderDir: string
}
