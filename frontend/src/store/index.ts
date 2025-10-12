import {create} from "zustand";
import { devtools } from "zustand/middleware";
import {createSidebarSlice, type SidebarStore} from "./sidebarStore";
import {createAuthSlice, type UserAuthStore} from "./user-auth"

type AllStores = SidebarStore & UserAuthStore;


export const useAppStore = create<AllStores>()(
    devtools((...a) => ({
        ...createAuthSlice(...a),
        ...createSidebarSlice(...a),
    }))
)