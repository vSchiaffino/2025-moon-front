import { Badge } from '@/components/ui/badge'
import { WorkItemState, workItemStateToLabel } from '@/types/work-item.types'

type VariantType =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'purple'

export const WorkItemStateBadge = ({ state }: { state: WorkItemState }) => {
  const stateToBadgeVariant: Record<WorkItemState, VariantType> = {
    [WorkItemState.PENDING]: 'secondary',
    [WorkItemState.WORKING]: 'outline',
    [WorkItemState.PAUSED]: 'warning',
    [WorkItemState.CANCELLED]: 'destructive',
    [WorkItemState.DONE]: 'success',
  }
  const label = workItemStateToLabel[state]
  const variant = stateToBadgeVariant[state]
  return <Badge variant={variant}>{label}</Badge>
}
