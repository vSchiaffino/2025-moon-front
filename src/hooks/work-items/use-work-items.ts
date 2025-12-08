import { getWorkItems } from '@/services/work-item'
import type {
  PaginatedQueryDto,
  PaginatedResponseDto,
} from '@/types/paginated.types'
import type { WorkItem } from '@/types/work-item.types'
import { useQuery } from 'react-query'

export function useWorkItems(query: PaginatedQueryDto) {
  const { data, ...rest } = useQuery(['work-items', query], () =>
    getWorkItems(query)
  )
  return { ...rest, workItems: data as PaginatedResponseDto<WorkItem> | null }
}
