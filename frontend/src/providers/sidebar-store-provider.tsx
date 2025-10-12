// "use client"

// import { type ReactNode, createContext, useRef, useContext } from 'react'
// import { type StoreApi, useStore } from 'zustand'

// import { type SidebarStore, createSidebarStor } from '@/store/sidebarStore'

// export const SidebarStoreContext = createContext<StoreApi<SidebarStore> | null>(
//   null,
// )

// export interface SidebarStoreProviderProps {
//   children: ReactNode
// }

// export const SidebarStoreProvider = ({ children }: SidebarStoreProviderProps) => {
//   const storeRef = useRef<StoreApi<SidebarStore>|null>(null)
//   if (!storeRef.current) {
//     storeRef.current = createSidebarStore()
//   }

//   return (
//     <SidebarStoreContext.Provider value={storeRef.current}>
//       {children}
//     </SidebarStoreContext.Provider>
//   )
// }

// export const useSidebar = <T,>(selector: (store: SidebarStore) => T): T => {
//   const sidebarStoreContext = useContext(SidebarStoreContext)

//   if (!sidebarStoreContext) {
//     throw new Error(`useSidebar must be used within a SidebarStoreProvider`)
//   }

//   return useStore(sidebarStoreContext, selector)
// }