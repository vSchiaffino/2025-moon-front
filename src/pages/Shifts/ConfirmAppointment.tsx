import { CustomDialog } from '@/components/CustomDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Shift } from '@/types/appointments.types'
import type { WorkItemDataDto } from '@/types/work-item.types'
import { useState } from 'react'
import { ServicesBadgesField } from './ServicesBadgesField'
import { SelectRamp } from '@/components/SelectRamp'

export interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (workItem: WorkItemDataDto) => Promise<void>
  appointment?: Shift
}

const defaultWorkItem: WorkItemDataDto = { mechanic: '', rampId: 0 }

export const ConfirmAppointmentDialog = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
}: Props) => {
  const [workItem, setWorkItem] = useState<WorkItemDataDto>(defaultWorkItem)
  if (!appointment) return <></>
  return (
    <CustomDialog
      isOpen={isOpen}
      onOpenChange={() => onClose()}
      title={'Confirmando turno'}
      onSave={async () => {
        await onConfirm(workItem)
        setWorkItem(defaultWorkItem)
      }}
      //   saveDisabled={}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='client'>Cliente</Label>
          <Input id='client' disabled value={appointment.user.fullName} />
        </div>
        <div className='space-y-2'>
          <Label>Servicios</Label>
          <ServicesBadgesField services={appointment.services} />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vehicle'>Vehículo</Label>
          <Input
            disabled
            id='vehicle'
            value={appointment.vehicle.model + ' - ' + appointment.vehicle.year}
            className='rounded-xl'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='name'>Mecánico</Label>
          <Input
            id='name'
            value={workItem.mechanic}
            onChange={(e) =>
              setWorkItem({
                ...workItem,
                mechanic: e.target.value,
              })
            }
            className='rounded-xl'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='state'>Rampa</Label>
          <SelectRamp
            value={workItem.rampId === 0 ? undefined : workItem.rampId}
            setValue={(rampId: number) =>
              setWorkItem({ ...workItem, rampId: rampId })
            }
          />
        </div>
      </div>
    </CustomDialog>
  )
}
