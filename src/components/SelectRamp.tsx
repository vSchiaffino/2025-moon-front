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
  value: number
  setValue: (value: number) => void
}) => {
  const { ramps } = useRamps({ page: 1, pageSize: 100 })
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
          <SelectItem disabled={ramp.state !== 'free'} value={String(ramp.id)}>
            {ramp.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
