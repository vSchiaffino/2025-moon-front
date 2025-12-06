export interface Ramp {
  id?: number
  code: string
  type: string
  state: RampState
}

export enum RampState {
  FREE = 'free',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export interface CreateRampDto {
  code: string
  type: string
  state: RampState
}
