import { getRampTypes } from '@/services/ramp'
import { useQuery } from 'react-query'

export function useRampTypes() {
  const { data, ...rest } = useQuery('ramp-types', () => getRampTypes())
  return { ...rest, rampTypes: data }
}
