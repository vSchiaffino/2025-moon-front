import { Container } from '@/components/Container'
import { useState } from 'react'
import {
  Calendar,
  Search,
  CircleDot,
  WrenchIcon,
  TriangleRight,
  Binary,
} from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CustomTable } from '@/components/CustomTable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkItemStateBadge } from './WorkItemStateBadge'
import { useWorkItems } from '@/hooks/work-items/use-work-items'
import type { PaginatedQueryDto } from '@/types/paginated.types'
import { type WorkItem, WorkItemState } from '@/types/work-item.types'
import { EditWorkItemDialog } from './EditWorkItemDialog'
import { StateMultiSelect } from './StateMultiSelect'

export function WorkItems() {
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(
    null
  )
  const [states, setStates] = useState<WorkItemState[]>([
    WorkItemState.PAUSED,
    WorkItemState.PENDING,
    WorkItemState.WORKING,
  ])
  const [pagination, setPagination] = useState<PaginatedQueryDto>({
    orderBy: 'id',
    orderDir: 'DESC',
    page: 1,
    pageSize: 10,
    search: '',
  })
  const { workItems, refetch } = useWorkItems(pagination, states)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil((workItems?.total || 0) / itemsPerPage)

  return (
    <Container>
      {selectedWorkItem && (
        <EditWorkItemDialog
          refetchWorkitems={async () => {
            await refetch()
          }}
          onSave={async () => {
            setSelectedWorkItem(null)
            await refetch()
          }}
          onClose={() => setSelectedWorkItem(null)}
          setWorkItem={setSelectedWorkItem}
          workItemId={selectedWorkItem.id}
        />
      )}
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold text-foreground'>
            Gestión de Ordenes de trabajo
          </h1>
          <p className='text-muted-foreground'>
            Administra y visualiza todas las ordenes de trabajo
          </p>
        </div>

        <div className='bg-card rounded-3xl shadow-sm border border-border/50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3'>
            <div>
              <h2 className='text-xl font-semibold text-foreground'>
                Ordenes de trabajo
              </h2>
              <p className='text-sm text-muted-foreground mt-1'>
                {/* {filteredShifts.length}{' '}
                {filteredShifts.length === 1
                  ? 'turno programado'
                  : 'turnos programados'} */}
              </p>
            </div>
            <div className='relative w-full md:w-80'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por cliente, fecha o servicio...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className='pl-10 rounded-xl'
              />
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3 p-3'>
            <span className='text-xs text-muted-foreground'>Filtros:</span>
            <div className='flex items-center gap-2 h-4 my-2'>
              <Label className='text-xs text-muted-foreground'>Estado</Label>
              <StateMultiSelect value={states} setValue={setStates} />
            </div>
          </div>

          <TooltipProvider>
            <CustomTable
              data={workItems?.data || []}
              columns={[
                {
                  key: 'id',
                  label: '# Numero',
                  icon: <Binary className='h-4 w-4' />,
                },
                {
                  key: 'state',
                  label: 'Estado',
                  icon: <CircleDot className='h-4 w-4' />,
                  render: (item) => <WorkItemStateBadge state={item.state} />,
                },
                {
                  key: 'mechanicName',
                  label: 'Mecánico asignado',
                  icon: <WrenchIcon className='h-4 w-4' />,
                  render: (item) => item.mechanicName,
                },
                {
                  key: 'ramp',
                  label: 'Rampa asignada',
                  icon: <TriangleRight className='h-4 w-4' />,
                  render: (item) => item.ramp.code,
                },
              ]}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={workItems?.total || 0}
              onRowClick={(item) => setSelectedWorkItem(item)}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              emptyState={{
                icon: <Calendar className='h-8 w-8 text-muted-foreground' />,
                title: 'No hay ordenes de trabajo',
                description: searchTerm
                  ? 'No se encontraron ordenes de trabajo con ese criterio de búsqueda'
                  : 'Aún no tenés ordenes de trabajo',
              }}
            />
          </TooltipProvider>
        </div>
      </div>
    </Container>
  )
}
