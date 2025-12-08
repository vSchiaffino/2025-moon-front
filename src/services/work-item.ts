import type { PaginatedQueryDto } from '@/types/paginated.types'
import type {
  CreateWorkItemDto,
  ModifyWorkItemDto,
  WorkItemState,
} from '@/types/work-item.types'
import { get, post, put } from '@/utils/rest-api'

export const createWorkItem = (dto: CreateWorkItemDto) => {
  return post('/work-items', dto)
}

export const getWorkItems = (query: PaginatedQueryDto) => {
  return get('/work-items', { params: query })
}

export const getWorkItemDetail = (id: number) => {
  return get(`/work-items/${id}`)
}

export const editWorkItem = (id: number, dto: ModifyWorkItemDto) => {
  return put(`/work-items/${id}`, dto)
}

export const changeWorkItemState = (id: number, state: WorkItemState) => {
  return put(`/work-items/${id}/state`, { state })
}
