import { getWorkItems } from '@/services/work-item'
import type {
  PaginatedQueryDto,
  PaginatedResponseDto,
} from '@/types/paginated.types'
import type { WorkItem, WorkItemState } from '@/types/work-item.types'
import { useQuery } from 'react-query'

export function useWorkItems(
  query: PaginatedQueryDto,
  states: WorkItemState[]
) {
  const { data, ...rest } = useQuery(['work-items', query, states], () =>
    getWorkItems(query, states)
  )
  return { ...rest, workItems: data as PaginatedResponseDto<WorkItem> | null }
}
