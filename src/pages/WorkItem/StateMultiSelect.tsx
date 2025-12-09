import { MultiSelect } from '@/components/MultiSelect'
import { WorkItemState, workItemStateToLabel } from '@/types/work-item.types'

export interface StateMultiSelectProps {
  value: WorkItemState[]
  setValue: (value: WorkItemState[]) => void
}

export const StateMultiSelect = ({
  value,
  setValue,
}: StateMultiSelectProps) => {
  const options = [
    WorkItemState.CANCELLED,
    WorkItemState.DONE,
    WorkItemState.PAUSED,
    WorkItemState.PENDING,
    WorkItemState.WORKING,
  ].map((state) => ({
    value: state,
    label: workItemStateToLabel[state],
  }))
  return (
    <MultiSelect
      options={options}
      selected={value}
      setSelected={(strValue) => setValue(strValue as WorkItemState[])}
      placeholder='Estados'
    />
  )
}
