'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@workspace/ui/components/sidebar'
import { PropsWithChildren } from 'react'
import { AdminSidebar } from './admin-sidebar'

const SidebarLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main>
          <SidebarTrigger className="absolute left-3 top-3" />
          <div className="px-4 pt-16 md:px-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SidebarLayout
