import type { StateCreator } from 'zustand';
import { SquareTerminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// import type { Project } from '@/types';

// Define types for better maintainability
export type NavItem = {
  id?: string;
  title: string;
  description : string;
  url: string;
};

export type NavMainSection = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

type SidebarState = {
  navMain: NavMainSection[];
};

type SidebarActions = {
  addProject: (project: NavItem) => void;
};

export type SidebarStore = SidebarState & SidebarActions;

// Initial state, extracted from app-sidebar.tsx
const initialNavMain: NavMainSection[] = [
  {
    title: "Team",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {  description: "", title: "Source", url: "/dashboard/team/source", id:"1234" },
      {  description: "", title: "Manufacturer", url: "/dashboard/team/manufacturer" , id:"12345" },
      {  description: "", title: "Distributor", url: "/dashboard/team/distributor" , id:"123456"},
    ],
  },
];

export const createSidebarSlice: StateCreator<SidebarStore, [], [], SidebarStore> = (set) => ({
  navMain: initialNavMain,
  addProject: (project) => set((state) => ({
    navMain: state.navMain.map(section => {
      if (section.title === "Team") {
        const newProjectItem = { description: project.description, title: project.title, url: `/dashboard/team/${project.title.toLowerCase()}`, id: project.id };
        // Avoid duplicates
        if (section.items?.some(item => item.id === newProjectItem.id)) return section;
        return { ...section, items: [...(section.items || []), newProjectItem] };
      }
      return section;
    })
  })),
});