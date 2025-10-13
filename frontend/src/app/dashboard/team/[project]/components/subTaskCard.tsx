import React from "react";
// import { useAuth } from "@/providers/user-auth-store-provider";
import {useAppStore} from "@/store"
import type { Subtask } from "@/types";

const SubTaskCard = ({ subtask }: { subtask: Subtask }) => {
  const { isAdmin } = useAppStore((state) => state);

  const createdBy = subtask.assigner?.name;

  return (
    <li
      className={`
     ${isAdmin && subtask.order % 3 === 0 && "bg-emerald-300"} 
      ${isAdmin && subtask.order % 2 === 0 && "bg-red-300"} 
      ${isAdmin && subtask.order % 1 === 0 && "bg-blue-300"} 
    group relative flex items-center justify-between p-1 rounded`}
    >
      <p className="text-sm text-gray-600 py-1 px-2">• {subtask.title}</p>

      {/* tag */}
      {isAdmin &&createdBy && (
        <div
          className="absolute left-11/12 -bottom-5 -translate-y-1/2 z-10
            flex items-center justify-center
            h-6 bg-gray-200 text-gray-700 text-xs font-bold
            rounded-full shadow-md transition-all duration-300 ease-in-out
            w-6 group-hover:w-auto group-hover:px-3
            overflow-hidden whitespace-nowrap cursor-default select-none
          "
        >
          <span className="group-hover:hidden">
            {createdBy.charAt(0).toUpperCase()}
          </span>
          <span className="hidden group-hover:inline">
            {" "}
            created by {createdBy}
          </span>
        </div>
      )}
    </li>
  );
};

export default SubTaskCard;
