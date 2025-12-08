import type { PaginatedQueryDto } from '@/types/paginated.types'
import type { CreateRampDto, RampState } from '@/types/ramp.types'
import { del, get, post, put } from '@/utils/rest-api'

export const createRamp = (dto: CreateRampDto) => {
  return post('/ramps', dto)
}

export const editRamp = (id: number, dto: CreateRampDto) => {
  return put(`/ramps/${id}`, dto)
}

export const getRampTypes = () => {
  return get('/ramps/types')
}

export const getRamps = (query: PaginatedQueryDto, states?: RampState[]) => {
  return get('/ramps', {
    params: { ...query, states: states ? states.join(',') : undefined },
  })
}

export const deleteRamp = (id: number) => {
  return del(`/ramps/${id}`)
}
