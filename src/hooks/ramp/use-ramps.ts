import { getRamps } from '@/services/ramp'
import type {
  PaginatedQueryDto,
  PaginatedResponseDto,
} from '@/types/paginated.types'
import type { Ramp } from '@/types/ramp.types'
import { useQuery } from 'react-query'

export function useRamps(query: PaginatedQueryDto) {
  const { data, ...rest } = useQuery(['ramps', query], () => getRamps(query))
  return { ...rest, ramps: data as PaginatedResponseDto<Ramp> | null }
}
