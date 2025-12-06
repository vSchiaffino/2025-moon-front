import { getRamps } from '@/services/ramp'
import type { PaginatedQueryDto } from '@/types/paginated.types'
import { useQuery } from 'react-query'

export function useRamps(query: PaginatedQueryDto) {
  const { data, ...rest } = useQuery(['ramps', query], () => getRamps(query))
  return { ...rest, ramps: data }
}
