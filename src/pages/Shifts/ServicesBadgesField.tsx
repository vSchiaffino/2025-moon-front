import { Badge } from '@/components/ui/badge'
import type { Service } from '@/types/services.types'
import React from 'react'

export const ServicesBadgesField = ({ services }: { services: Service[] }) => {
  return (
    <div className='flex flex-wrap gap-1'>
      {services.map((service: Service) => (
        <Badge
          key={service.id}
          variant='secondary'
          className='text-xs rounded-full'
        >
          {service.name}
        </Badge>
      ))}
    </div>
  )
}
