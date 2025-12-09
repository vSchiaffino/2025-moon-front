import { CustomDialog } from '@/components/CustomDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  WorkItemState,
  type ModifyWorkItemDto,
  type WorkItem,
} from '@/types/work-item.types'
import React, { useState } from 'react'
import { WorkItemStateBadge } from './WorkItemStateBadge'
import { SelectRamp } from '@/components/SelectRamp'
import { changeWorkItemState, editWorkItem } from '@/services/work-item'
import { Button } from '@/components/ui/button'
import { useWorkItemDetail } from '@/hooks/work-items/use-work-item-detail'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, CircleDotIcon } from 'lucide-react'
import { format } from 'date-fns'

export interface EditWorkItemProps {
  workItemId?: number
  setWorkItem: React.Dispatch<React.SetStateAction<WorkItem | null>>
  onClose: () => void
  onSave: () => Promise<void>
  refetchWorkitems: () => Promise<void>
}

export const EditWorkItemDialog = ({
  workItemId,
  onClose,
  onSave,
  refetchWorkitems,
}: EditWorkItemProps) => {
  const [dto, setDto] = useState<ModifyWorkItemDto>({ mechanic: '', rampId: 0 })
  const { workItem, refetch } = useWorkItemDetail(workItemId, (detail) => {
    setDto({ mechanic: detail.mechanicName, rampId: detail.ramp.id as number })
  })
  const onStateChange = async (state: WorkItemState) => {
    if (!workItemId) return
    await changeWorkItemState(workItemId, state)
    await refetch()
    await refetchWorkitems()
  }
  if (!workItem) return <></>
  return (
    <CustomDialog
      isOpen={workItem != null}
      onOpenChange={onClose}
      title={`Editando orden de trabajo #${workItemId}`}
      onSave={async () => {
        if (!workItemId) return
        await editWorkItem(workItemId, dto)
        await onSave()
      }}
    >
      <div className='space-y-4 max-h-[70vh] overflow-y-auto pr-1'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Numero</Label>
          <Input
            id='id'
            disabled
            value={workItemId || ''}
            className='rounded-xl'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='appointment'>Turno asociado</Label>
          <Input
            id='appointment'
            disabled
            value={`#${workItem.appointment.id}`}
            className='rounded-xl'
          />
        </div>
        {workItem.realWorkTimeMs && (
          <div className='space-y-2'>
            <Label htmlFor='time'>Tiempo de trabajo real (minutos)</Label>
            <Input
              id='time'
              disabled
              value={Math.floor(workItem.realWorkTimeMs / (60 * 1000))}
              className='rounded-xl'
            />
          </div>
        )}
        <div className='space-y-2'>
          <Label htmlFor='name'>Mecánico asignado</Label>
          <Input
            id='name'
            value={dto.mechanic || ''}
            onChange={(e) => setDto({ ...dto, mechanic: e.target.value })}
            className='rounded-xl'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='state'>Rampa asignada</Label>
          <SelectRamp
            value={dto.rampId}
            setValue={(rampId) => setDto({ ...dto, rampId })}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='state'>Estado actual</Label>
          <WorkItemStateBadge state={workItem.state} />
        </div>
        {workItem.state !== WorkItemState.CANCELLED &&
          workItem.state !== WorkItemState.DONE && (
            <div className='space-y-2'>
              <Label>Cambiar estado</Label>
              <div className='space-x-2 space-y-2'>
                {(workItem.state === WorkItemState.PENDING ||
                  workItem.state === WorkItemState.PAUSED) && (
                  <Button
                    variant={'foreground'}
                    onClick={() => onStateChange(WorkItemState.WORKING)}
                  >
                    {WorkItemState.PENDING ? 'Iniciar' : 'Continuar'} trabajo
                  </Button>
                )}
                {workItem.state === WorkItemState.WORKING && (
                  <Button
                    variant={'secondary'}
                    onClick={() => onStateChange(WorkItemState.PAUSED)}
                  >
                    Pausar trabajo
                  </Button>
                )}
                <Button
                  variant={'success'}
                  onClick={() => onStateChange(WorkItemState.DONE)}
                >
                  Finalizar
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={() => onStateChange(WorkItemState.CANCELLED)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        <div className='space-y-2'>
          <Label htmlFor='state'>Registro de movimientos</Label>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent border-border/50'>
                <TableHead className='h-12'>
                  <div className='flex items-center gap-2 text-foreground/80 font-medium'>
                    <Calendar className='h-4 w-4' />
                    Fecha de registro
                  </div>
                </TableHead>
                <TableHead className='h-12'>
                  <div className='flex items-center gap-2 text-foreground/80 font-medium'>
                    <CircleDotIcon className='h-4 w-4' />
                    Estado antes
                  </div>
                </TableHead>
                <TableHead className='h-12'>
                  <div className='flex items-center gap-2 text-foreground/80 font-medium'>
                    <CircleDotIcon className='h-4 w-4' />
                    Estado después
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workItem.logs.map((item, idx) => (
                <TableRow
                  key={idx}
                  className={`border-border/50 transition-all duration-200`}
                >
                  <TableCell className='py-4'>
                    {format(item.createdAt, 'dd-MM-yyyy HH:mm')}
                  </TableCell>
                  <TableCell className='py-4'>
                    {item.fromState && (
                      <WorkItemStateBadge state={item.fromState} />
                    )}
                  </TableCell>
                  <TableCell className='py-4'>
                    <WorkItemStateBadge state={item.toState} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </CustomDialog>
  )
}
