import { createStore } from 'zustand';
import { SquareTerminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { devtools } from 'zustand/middleware';

// Define types for better maintainability
type NavItem = {
  title: string;
  url: string;
};

type NavMainSection = {
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
  addProject: (project: { 
    title: string;
    description : string;
 }) => void;
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
      { title: "Source", url: "/dashboard/team/source" },
      { title: "Manufacturer", url: "/dashboard/team/manufacturer" },
      { title: "Distributor", url: "/dashboard/team/distributor" },
    ],
  },
];

export const createSidebarStore = (
  initState: SidebarState = { navMain: initialNavMain }
) => {
  return createStore<SidebarStore>()(devtools((set) => ({
    ...initState,
    addProject: (project) => set((state) => ({
      navMain: state.navMain.map(section => {
        if (section.title === "Team") {
          const newProjectItem = { title: project.title, url: `/dashboard/team/${project.title.toLowerCase()}` };
          return { ...section, items: [...(section.items || []), newProjectItem] };
        }
        return section;
      })
    })),
  })));
}