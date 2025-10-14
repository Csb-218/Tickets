"use client"

import * as React from "react"
import {server} from "@/config/Axios"
import type {NavItem} from "@/store/sidebarStore"
import type {Project} from "@/types"
// import { useSidebar } from "@/providers/sidebar-store-provider"
import {useAppStore} from "@/store"
import {
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { AdminToggle } from "@/components/auth/admin-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "User",
    email: "user@cognitoinnovations.com",
    avatar: "/avatars/shadcn.jpg"
  },
  
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {navMain,addProject}  = useAppStore((state) => state);
  

  React.useEffect(()=>{

    //fetch projects 
    const fetchProjects = async () =>{

         const res = await server({
          "url" : "/api/project"
         })

         console.log(res)

         res.data.forEach((project:Project) =>{
          const item:NavItem ={
            title : project.name,
            url : `/dashboard/team/${project.name}`,
            description : project.description || "",
            id : project.id
          }

          addProject(item)

         });

    }

    fetchProjects()

  },[])

  return (
    <Sidebar variant="inset" {...props} className="z-50">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-[#D732A8] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                 
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Cognito</span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <AdminToggle />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
