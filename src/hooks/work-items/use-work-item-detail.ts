import { getWorkItemDetail } from '@/services/work-item'
import type { WorkItem } from '@/types/work-item.types'
import { useQuery } from 'react-query'

export function useWorkItemDetail(
  id?: number,
  onSuccess?: ((data: WorkItem) => void) | undefined
) {
  const { data, ...rest } = useQuery(
    ['work-items-detail', id],
    () => (id ? getWorkItemDetail(id) : null),
    { onSuccess }
  )
  return { ...rest, workItem: data as WorkItem | null }
}
