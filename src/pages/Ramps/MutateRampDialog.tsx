import { CustomDialog } from '@/components/CustomDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RampState, type Ramp } from '@/types/ramp.types'
import React from 'react'
import { AutocompleteSelect } from './TypeInput'
import { useRampTypes } from '@/hooks/ramp/use-ramp-types'

export interface MutateRampDialogProps {
  ramp: Ramp | null
  setRamp: React.Dispatch<React.SetStateAction<Ramp | null>>
  onSave: () => Promise<void>
}

export const MutateRampDialog = ({
  ramp,
  setRamp,
  onSave,
}: MutateRampDialogProps) => {
  const { rampTypes, refetch } = useRampTypes()
  if (!ramp) return <></>
  return (
    <CustomDialog
      isOpen={ramp != null}
      onOpenChange={(open) => setRamp(!open ? null : ramp)}
      title={ramp?.code ? `Editando rampa #${ramp.code}` : 'Creando rampa'}
      onSave={async () => {
        await onSave()
        await refetch()
      }}
      //   saveDisabled={}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Código</Label>
          <Input
            id='code'
            value={ramp.code || ''}
            onChange={(e) =>
              setRamp({
                ...ramp,
                code: e.target.value,
              })
            }
            className='rounded-xl'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='state'>Estado actual</Label>
          <Select
            value={ramp.state}
            onValueChange={(state: RampState) => setRamp({ ...ramp, state })}
          >
            <SelectTrigger className='w-32 rounded-xl'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value={RampState.FREE}>Libre</SelectItem>
              <SelectItem value={RampState.OCCUPIED}>Ocupada</SelectItem>
              <SelectItem value={RampState.MAINTENANCE}>
                En mantenimiento
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='type'>Tipo</Label>
          <AutocompleteSelect
            value={ramp.type}
            setValue={(type) => setRamp({ ...ramp, type })}
            options={rampTypes}
            placeholder='example'
          />
        </div>
      </div>
    </CustomDialog>
  )
}
