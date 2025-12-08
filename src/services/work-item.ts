import type { CreateWorkItemDto } from '@/types/work-item.types'
import { post } from '@/utils/rest-api'

export const createWorkItem = (dto: CreateWorkItemDto) => {
  return post('/work-items', dto)
}
