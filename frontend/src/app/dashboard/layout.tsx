"use client"
import { Fragment, useState } from 'react'
import { SidebarStoreProvider } from '@/providers/sidebar-store-provider'
import { usePathname,useParams } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AddProjectDialog from "@/app/dashboard/team/[project]/components/AddProject"
import {decodeUrlString} from "@/lib/utils"

export default function DashBoardLayout({
  children,

}: {
  children: React.ReactNode

}) {

  const app_url:string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const pathname: string = usePathname()
  const params = useParams()
  const breadcrumbs: string[] = pathname.split('/')
  

  console.log(pathname,app_url,breadcrumbs,params)
  return (
    <SidebarStoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between px-4 h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {
                    breadcrumbs.map((breadcrumb, index) => {
                      return (
                        <Fragment key={index}>
                          { 
                            index !== breadcrumbs.length-1 &&
                            <>
                            <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href={`${app_url}${decodeUrlString(breadcrumbs.slice(0,index+1).join('/'))}`}>
                              {breadcrumb}
                            </BreadcrumbLink> 
                            </BreadcrumbItem>
                             <BreadcrumbSeparator className="hidden md:block" />
                            </>
                            
                            }
                            {
                              index === breadcrumbs.length-1 &&
                              <BreadcrumbItem>
                              <BreadcrumbPage>{decodeUrlString(breadcrumb)}</BreadcrumbPage>
                            </BreadcrumbItem>
                            }
                        </Fragment>
                      )
                    })
                  }
                 
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {/* Add Project Dialog */}
            <AddProjectDialog/>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
        </div>
          {/* {children} */}
        </SidebarInset>
      </SidebarProvider>
    </SidebarStoreProvider>
  )
}