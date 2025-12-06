import { Container } from '@/components/Container'
import { CustomTable } from '@/components/CustomTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RampState, type Ramp } from '@/types/ramp.types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select'
import { Box, Hash, Package, Plus, Search, Trash } from 'lucide-react'
import { RampStateBadge } from './RampStateBadge'
import { useState } from 'react'
import { MutateRampDialog } from './MutateRampDialog'
import { createRamp, deleteRamp, editRamp } from '@/services/ramp'
import { useRamps } from '@/hooks/ramp/use-ramps'
import { type PaginatedQueryDto } from '@/types/paginated.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const Ramps = () => {
  const [deletingRampId, setDeletingRampId] = useState(null)
  const [pagination, setPagination] = useState<PaginatedQueryDto>({
    orderBy: 'id',
    orderDir: 'DESC',
    page: 1,
    pageSize: 10,
    search: '',
  })
  const [selectedRamp, setSelectedRamp] = useState<Ramp | null>(null)
  const { ramps, isLoading, refetch } = useRamps(pagination)
  return (
    <Container>
      <AlertDialog
        open={deletingRampId !== null}
        onOpenChange={() => setDeletingRampId(null)}
      >
        <AlertDialogContent className='text-foreground rounded-3xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar rampa?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Estás por eliminar la rampa con id {deletingRampId}. Esta acción no
            se puede deshacer.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-xl'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deletingRampId) return
                await deleteRamp(deletingRampId)
                await refetch()
                setDeletingRampId(null)
              }}
              className='rounded-xl'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <MutateRampDialog
        ramp={selectedRamp}
        setRamp={setSelectedRamp}
        onSave={async () => {
          if (!selectedRamp) return
          if (selectedRamp?.id !== undefined) {
            await editRamp(selectedRamp.id, selectedRamp)
          } else {
            await createRamp(selectedRamp)
          }
          await refetch()
        }}
      />
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold text-foreground'>
            Gestión de Rampas
          </h1>
          <p className='text-muted-foreground'>Administra las rampas</p>
        </div>

        <div className='bg-card rounded-3xl shadow-sm border border-border/50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3'>
            <div>
              <h2 className='text-xl font-semibold text-foreground'>Rampas</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                {ramps?.total || 0}{' '}
                {ramps?.total === 1 ? 'rampa registrada' : 'rampas registradas'}
              </p>
            </div>
            <div className='space-x-4'>
              <Button
                className='rounded-xl'
                onClick={() =>
                  setSelectedRamp({ code: '', state: RampState.FREE, type: '' })
                }
              >
                <Plus className='h-4 w-4 mr-2' />
                Agregar Rampa
              </Button>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6'>
            <div className='relative w-full sm:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por codigo...'
                value={pagination.search}
                onChange={(e) =>
                  setPagination((curr) => ({ ...curr, search: e.target.value }))
                }
                className='pl-10 rounded-xl'
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Ordenar por</span>
              <Select
                value={pagination.orderBy}
                onValueChange={(val) => {
                  setPagination((prev) => ({ ...prev, page: 1, orderBy: val }))
                }}
              >
                <SelectTrigger className='w-32 rounded-xl'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='code'>Código</SelectItem>
                  <SelectItem value='type'>Tipo</SelectItem>
                  <SelectItem value='state'>Estado</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={pagination.orderDir}
                onValueChange={(val) => {
                  setPagination((prev) => ({ ...prev, page: 1, orderDir: val }))
                }}
              >
                <SelectTrigger className='w-24 rounded-xl'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='asc'>ASC</SelectItem>
                  <SelectItem value='desc'>DESC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CustomTable
            data={ramps?.data || []}
            columns={[
              {
                key: 'code',
                label: 'Código',
                icon: <Hash className='h-4 w-4' />,
                render: (item) => (
                  <span className='font-medium'>{item.code}</span>
                ),
              },
              {
                key: 'type',
                label: 'Tipo de rampa',
                icon: <Package className='h-4 w-4' />,
                render: (item) => item.type,
              },
              {
                key: 'state',
                label: 'Estado',
                icon: <Box className='h-4 w-4' />,
                render: RampStateBadge,
              },
              {
                key: 'actions',
                label: 'Acciones',
                render: (item) => (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletingRampId(item.id)
                    }}
                    className='rounded-xl text-destructive hover:bg-destructive/20 hover:text-destructive'
                  >
                    <Trash className='h-4 w-4' />
                  </Button>
                ),
              },
            ]}
            onRowClick={(item) => {
              setSelectedRamp(item as Ramp)
            }}
            currentPage={pagination.page}
            totalPages={Math.ceil(
              (ramps?.total || 0) / (pagination.pageSize || 10)
            )}
            totalItems={ramps?.total || 0}
            itemsPerPage={pagination.pageSize}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            loading={isLoading}
            emptyState={{
              icon: <Package className='h-8 w-8 text-muted-foreground' />,
              title: 'No hay rampas registrados',
              description: pagination.search
                ? 'No se encontraron rampas con ese criterio de búsqueda'
                : 'Comienza crando tu primer rampa',
            }}
          />
        </div>
      </div>
    </Container>
  )
}
