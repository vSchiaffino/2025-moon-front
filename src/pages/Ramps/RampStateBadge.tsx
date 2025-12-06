import { Badge } from '@/components/ui/badge'
import { RampState } from '@/types/ramp.types'

export const RampStateBadge = ({ state }: { state: RampState }) => {
  const stateToVariantMap: Record<
    RampState,
    'success' | 'secondary' | 'destructive'
  > = {
    [RampState.FREE]: 'success',
    [RampState.OCCUPIED]: 'secondary',
    [RampState.MAINTENANCE]: 'destructive',
  }
  const stateToLabelMap: Record<RampState, string> = {
    [RampState.FREE]: 'Libre',
    [RampState.OCCUPIED]: 'Ocupada',
    [RampState.MAINTENANCE]: 'En mantenimiento',
  }
  return (
    <Badge variant={stateToVariantMap[state]} className='rounded-full'>
      {stateToLabelMap[state]}
    </Badge>
  )
}
