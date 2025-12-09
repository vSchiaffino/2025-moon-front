import type { Shift } from './appointments.types'
import type { Ramp } from './ramp.types'

export interface WorkItemDataDto {
  mechanic: string
  rampId: number
}

export interface CreateWorkItemDto {
  mechanic: string
  rampId: number
  appointmentId: number
}

export interface WorkItem {
  id: number
  realWorkTimeMs?: number
  state: WorkItemState
  mechanicName: string
  ramp: Ramp
  appointment: Shift
  logs: WorkItemLogs[]
}

export interface WorkItemLogs {
  createdAt: Date
  fromState: WorkItemState | null
  toState: WorkItemState
}

export enum WorkItemState {
  PENDING = 'pending',
  WORKING = 'working',
  PAUSED = 'paused',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export const workItemStateToLabel: Record<WorkItemState, string> = {
  [WorkItemState.PENDING]: 'Pendiente',
  [WorkItemState.WORKING]: 'En ejecución',
  [WorkItemState.PAUSED]: 'Pausada',
  [WorkItemState.CANCELLED]: 'Cancelada',
  [WorkItemState.DONE]: 'Finalizada',
}

export interface ModifyWorkItemDto {
  mechanic: string
  rampId: number
}
