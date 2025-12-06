import { Container } from '@/components/Container'
import { Button } from '@/components/ui/button'
import { Check, Search, Plus, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Hash, Package, Box } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CreateService, Service } from '@/types/services.types'
import { useQuery } from 'react-query'
import type {
  PaginatedQueryDto,
  PaginatedResponseDto,
} from '@/types/paginated.types'
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from '@/services/services'
import type { SparePart, SparePartData } from '@/types/spare-part.types'
import { Badge } from '@/components/ui/badge'
import { getServiceStatus, ServiceStatusEnum } from '@/helpers/service-status'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { CustomTable } from '@/components/CustomTable'
import { CustomDialog } from '@/components/CustomDialog'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/MultiSelect'
import {
  getSpareParts,
  create as createSparePart,
} from '@/services/spare-parts'

export function Services() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<CreateService | null>(
    null
  )
  const [pagination, setPagination] = useState<PaginatedQueryDto>({
    page: 1,
    pageSize: 10,
    search: '',
    orderBy: 'id',
    orderDir: 'asc',
  })
  const [searchInput, setSearchInput] = useState<string>('')
  const [spareParts, setSpareParts] = useState<SparePartData[]>([])
  const [selectedSpareParts, setSelectedSpareParts] = useState<SparePartData[]>(
    []
  )

  const mapToCreateService = (service: Service): CreateService => {
    const rawSpareParts = (service?.spareParts as SparePart[]) ?? []
    const mappedSpareParts = rawSpareParts
      .map((sp) => {
        const spRec = (sp ?? {}) as Record<string, unknown>
        const nested = (spRec.sparePart as Record<string, unknown>) || undefined
        const sparePartId = ((): number | null => {
          if (typeof spRec.sparePartId !== 'undefined')
            return Number(spRec.sparePartId)
          if (nested && typeof nested.id !== 'undefined')
            return Number(nested.id)
          return null
        })()
        let quantity = Number(spRec.quantity)
        if (!quantity || quantity < 1) quantity = 1
        if (sparePartId == null || !Number.isFinite(sparePartId)) return null
        return { sparePartId, quantity, serviceId: service.id, sparePart: sp }
      })
      .filter(
        (
          v
        ): v is {
          sparePartId: number
          quantity: number
          serviceId: number
          sparePart: SparePart
        } => v !== null
      )

    return {
      id: typeof service.id !== 'undefined' ? Number(service.id) : undefined,
      name: (service.name as string) ?? '',
      price: Number(service.price),
      spareParts: mappedSpareParts,
    }
  }

  const onSave = async () => {
    const isCreating = !editingService?.id
    if (isCreating) {
      const payload = mapToCreateService(editingService as Service)
      await createService(payload)
    } else {
      const payload = mapToCreateService(editingService as Service)
      await updateService(payload)
    }
    setIsOpen(false)
    setEditingService(null)
    refetch()
  }

  const { data, refetch, isLoading } = useQuery<PaginatedResponseDto<Service>>(
    ['services', pagination],
    () => getServices(pagination),
    {
      initialData: undefined,
      cacheTime: 0,
      onSuccess: (data) => {
        if (
          pagination.page != data.page ||
          pagination.pageSize != data.pageSize
        ) {
          setPagination({
            ...pagination,
            page: data.page,
            pageSize: data.pageSize,
          })
        }
      },
    }
  )

  const totalPages = useMemo(() => {
    if (!data) return 1
    return Math.max(1, Math.ceil(data.total / pagination.pageSize))
  }, [data, pagination.pageSize])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1, search: searchInput }))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    getSpareParts({
      page: 1,
      pageSize: 1000,
      orderBy: 'name',
      orderDir: 'asc',
      search: '',
    }).then((response) => {
      if (!response || !response.data) return
      setSpareParts(response.data)
    })
  }, [])

  useEffect(() => {
    setEditingService((current) => {
      const base = current ?? { name: '', price: 0, id: 0, spareParts: [] }

      const nextSpareParts = selectedSpareParts
        .filter((sp) => typeof sp.id === 'number')
        .map((sp) => ({
          quantity:
            base?.spareParts.find((s) => s.sparePartId === sp.id)?.quantity ||
            1,
          sparePartId: Number(sp.id),
        }))

      const isSameLength =
        (base.spareParts?.length || 0) === nextSpareParts.length
      const isSameValues = isSameLength
        ? base.spareParts.every(
            (s, i) =>
              s.sparePartId === nextSpareParts[i].sparePartId &&
              s.quantity === nextSpareParts[i].quantity
          )
        : false

      if (isSameValues) return current

      return { ...base, spareParts: nextSpareParts }
    })
  }, [selectedSpareParts])

  return (
    <Container>
      <CustomDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={
          editingService?.id
            ? `Editando servicio #${editingService.id}`
            : 'Creando servicio'
        }
        onSave={onSave}
        saveDisabled={!editingService?.name}
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input
              id='name'
              value={editingService?.name || ''}
              onChange={(e) =>
                setEditingService({ ...editingService!, name: e.target.value })
              }
              className='rounded-xl'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='price'>Precio</Label>
            <Input
              id='price'
              type='number'
              min={0}
              value={editingService?.price || 0}
              onChange={(e) =>
                setEditingService({
                  ...editingService!,
                  price: Math.max(0, Number(e.target.value)),
                })
              }
              className='rounded-xl'
            />
          </div>
          <div className='space-y-2 w-full'>
            <Label htmlFor='price'>Repuestos</Label>
            {spareParts.length > 0 ? (
              <MultiSelect
                options={spareParts.map((sparePart) => ({
                  value: sparePart.id?.toString() || '',
                  label: sparePart.name || '',
                }))}
                selected={selectedSpareParts.map((s) => s.id?.toString() || '')}
                setSelected={(ids) => {
                  setSelectedSpareParts(
                    ids
                      .map((id) =>
                        spareParts.find(
                          (s) => s?.id?.toString() === id.toString()
                        )
                      )
                      .filter((sp) => sp !== undefined)
                  )
                }}
                hasInput={true}
                placeholder='Selecciona repuestos'
                onCreate={async (value) => {
                  const created = (await createSparePart({
                    name: value,
                    stock: 0,
                  })) as SparePartData
                  if (!created || typeof created.id !== 'number') return
                  setSpareParts((prev) => [...prev, created])
                  setSelectedSpareParts((prev) => [...prev, created])
                }}
              />
            ) : (
              <div>
                <div className='grid w-full items-center gap-1.5 mt-4'>
                  <p className='text-sm text-muted-foreground italic'>
                    Debes crear un repuesto para el servicio primero.
                  </p>
                </div>
              </div>
            )}

            {selectedSpareParts.map((sp) => (
              <div
                key={sp.id}
                className='flex items-center justify-between gap-3'
              >
                <div>
                  <button
                    type='button'
                    aria-label='Eliminar repuesto'
                    className='text-destructive hover:opacity-50 px-2 cursor-pointer mr-2'
                    onClick={() =>
                      setSelectedSpareParts(
                        selectedSpareParts.filter((s) => s.id !== sp.id)
                      )
                    }
                  >
                    x
                  </button>
                  <span className='text-sm'>{sp.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Label htmlFor={`qty-${sp.id}`}>Cantidad</Label>
                  <Input
                    id={`qty-${sp.id}`}
                    type='number'
                    min={1}
                    value={
                      editingService?.spareParts.find(
                        (s) => s.sparePartId.toString() === sp.id?.toString()
                      )?.quantity
                    }
                    onChange={(e) =>
                      setEditingService((current) => {
                        if (!current) return current

                        const newSpareParts = current.spareParts.map((s) =>
                          s.sparePartId == sp.id
                            ? { ...s, quantity: Number(e.target.value) }
                            : s
                        )

                        return {
                          ...current,
                          spareParts: newSpareParts,
                        }
                      })
                    }
                    className='w-28'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomDialog>

      <div className='flex flex-col gap-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Gestión de Servicios
            </h1>
            <p className='text-muted-foreground'>
              Administra el inventario de servicios y su precio
            </p>
          </div>
        </div>

        <div className='bg-card rounded-3xl shadow-sm border border-border/50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3'>
            <div>
              <h2 className='text-xl font-semibold text-foreground'>
                Inventario de Servicios
              </h2>
              <p className='text-sm text-muted-foreground mt-1'>
                {data?.total || 0}{' '}
                {data?.total === 1
                  ? 'servicio registrado'
                  : 'servicios registrados'}
              </p>
            </div>

            <Button
              onClick={() => {
                setSelectedSpareParts([])
                setEditingService({ name: '', price: 0, spareParts: [] })
                setIsOpen(true)
              }}
              className='rounded-xl'
            >
              <Plus className='h-4 w-4 mr-2' />
              Agregar Servicio
            </Button>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-3'>
            <div className='relative w-full sm:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por nombre...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='pl-10 rounded-xl'
              />
            </div>
          </div>

          <CustomTable
            data={data?.data || []}
            columns={[
              {
                key: 'id',
                label: 'ID',
                icon: <Hash className='h-4 w-4' />,
                render: (item) => (
                  <span className='font-medium'>{item.id}</span>
                ),
              },
              {
                key: 'name',
                label: 'Nombre',
                icon: <Package className='h-4 w-4' />,
                render: (item) => item.name,
              },
              {
                key: 'price',
                label: 'Precio',
                icon: <Box className='h-4 w-4' />,
                render: (item) => <span>${item.price}</span>,
              },
              {
                key: 'status',
                label: 'Estado',
                icon: <Check className='h-4 w-4' />,
                render: (item) => (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant={
                            getServiceStatus(item) === ServiceStatusEnum.ACTIVO
                              ? 'success'
                              : getServiceStatus(item) ===
                                ServiceStatusEnum.FALTA_STOCK
                              ? 'warning'
                              : 'destructive'
                          }
                          className='rounded-full'
                        >
                          {getServiceStatus(item)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent
                        className={
                          getServiceStatus(item) !== ServiceStatusEnum.BLOQUEADO
                            ? 'hidden'
                            : ''
                        }
                      >
                        <p>
                          El servicio está bloqueado hasta que se vuelva a
                          guardar, ya que previamente se eliminó un repuesto
                          requerido para el servicio.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ),
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
                      setIsAlertDialogOpen(true)
                      setEditingService(item)
                    }}
                    className='rounded-xl hover:bg-destructive/10 hover:text-destructive'
                  >
                    <Trash size={20} />
                  </Button>
                ),
              },
            ]}
            onRowClick={(item) => {
              setIsOpen(true)
              setEditingService(mapToCreateService(item as Service))
              const selectedSparePartsIds =
                item.spareParts
                  .map((sp) => sp.sparePartId.toString())
                  .filter((sp) => sp !== undefined) || []
              setSelectedSpareParts(
                spareParts.filter((sp) =>
                  selectedSparePartsIds.includes(sp.id?.toString() || '')
                )
              )
            }}
            currentPage={pagination.page}
            totalPages={totalPages}
            totalItems={data?.total || 0}
            itemsPerPage={pagination.pageSize}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            loading={isLoading}
            emptyState={{
              icon: <Package className='h-8 w-8 text-muted-foreground' />,
              title: 'No hay servicios registrados',
              description: searchInput
                ? 'No se encontraron servicios con ese criterio de búsqueda'
                : 'Comienza agregando tu primer servicio',
            }}
          />
        </div>

        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent className='text-foreground rounded-3xl'>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Estás por eliminar el servicio {editingService?.name}. Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className='rounded-xl'></AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteService(editingService!.id!).then(() => refetch())
                }
                className='rounded-xl'
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Container>
  )
}
