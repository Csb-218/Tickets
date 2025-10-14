import {create} from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import {createSidebarSlice, type SidebarStore} from "./sidebarStore";
import {createAuthSlice, type UserAuthStore} from "./user-auth"

type AllStores = SidebarStore & UserAuthStore;

/**
 * Combined App Store with Persistence
 * 
 * This store combines both auth and sidebar state with proper persistence.
 * Each slice has its own persistence configuration, but they're combined here
 * into a single store for easier state management.
 */
export const useAppStore = create<AllStores>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createSidebarSlice(...a),
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        // Partition persistence by slice
        partialize: (state) => ({
          // Auth state persistence
          isAdmin: state.isAdmin,
          isAuthenticated: state.isAuthenticated,
          email: state.email,
          // Sidebar state persistence
          navMain: state.navMain,
        }),
        version: 1,
        // Custom merge to handle both slices
        merge: (persistedState, currentState) => {
          const typedPersisted = persistedState as Partial<AllStores>;
          
          // Log restoration
          if (typedPersisted?.isAdmin || typedPersisted?.navMain?.length) {
            console.log('🔄 Restoring app state from localStorage');
            console.log('- Auth state:', {
              isAdmin: typedPersisted?.isAdmin,
              isAuthenticated: typedPersisted?.isAuthenticated,
              email: typedPersisted?.email
            });
            console.log('- Sidebar projects:', typedPersisted?.navMain?.[0]?.items?.length || 0);
          }
          
          return {
            ...currentState,
            // Restore auth state
            isAdmin: typedPersisted?.isAdmin ?? false,
            isAuthenticated: typedPersisted?.isAuthenticated ?? false,
            email: typedPersisted?.email ?? null,
            loading: true, // Always start loading
            user: null, // Never persist user object
            // Restore sidebar state with icon restoration
            navMain: typedPersisted?.navMain ? 
              typedPersisted.navMain.map(section => ({
                ...section,
                icon: section.title === 'Team' ? 
                  currentState.navMain.find(s => s.title === 'Team')?.icon || section.icon 
                  : section.icon
              })) : currentState.navMain,
          };
        },
      }
    ),
    { name: 'app-store' }
  )
)
