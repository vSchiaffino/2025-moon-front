import { RampState } from '@/types/ramp.types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useRamps } from '@/hooks/ramp/use-ramps'

export const SelectRamp = ({
  value,
  setValue,
}: {
  value?: number
  setValue: (value: number) => void
}) => {
  const { ramps } = useRamps({ page: 1, pageSize: 100 }, [RampState.FREE])
  return (
    <Select
      value={value?.toString() || ''}
      onValueChange={(rampId: string) => setValue(Number(rampId))}
    >
      <SelectTrigger className='w-32 rounded-xl'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='rounded-xl'>
        {ramps?.data.map((ramp) => (
          <SelectItem value={String(ramp.id || 0)}>{ramp.code}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
