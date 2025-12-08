import { Badge } from '@/components/ui/badge'
import { WorkItemState } from '@/types/work-item.types'

type VariantType =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'purple'

export const WorkItemStateBadge = ({ state }: { state: WorkItemState }) => {
  const stateToLabel: Record<WorkItemState, string> = {
    [WorkItemState.PENDING]: 'Pendiente',
    [WorkItemState.WORKING]: 'En ejecución',
    [WorkItemState.PAUSED]: 'Pausada',
    [WorkItemState.CANCELLED]: 'Cancelada',
    [WorkItemState.DONE]: 'Finalizada',
  }
  const stateToBadgeVariant: Record<WorkItemState, VariantType> = {
    [WorkItemState.PENDING]: 'secondary',
    [WorkItemState.WORKING]: 'outline',
    [WorkItemState.PAUSED]: 'warning',
    [WorkItemState.CANCELLED]: 'destructive',
    [WorkItemState.DONE]: 'success',
  }
  const label = stateToLabel[state]
  const variant = stateToBadgeVariant[state]
  return <Badge variant={variant}>{label}</Badge>
}
