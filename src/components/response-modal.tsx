import * as React from 'react'
import { useIsMobile } from '@/hooks/use-mobile.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

interface ResponsiveModalProps {
  title?: string
  description?: string
  children: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disableSwipe?: boolean
}

export function ResponsiveModal({
  title,
  description,
  children,
  trigger,
  open,
  onOpenChange,
  disableSwipe,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} key='dialog'>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className='w-auto max-w-none min-w-md sm:max-w-none'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      key='drawer'
      handleOnly={disableSwipe}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className='px-4 py-4'>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <div className='flex-1 overflow-y-auto'>{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
