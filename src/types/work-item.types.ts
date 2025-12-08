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

export interface ModifyWorkItemDto {
  mechanic: string
  rampId: number
}
