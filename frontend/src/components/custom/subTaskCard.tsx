import React from 'react'
import {useAuth} from "@/providers/user-auth-store-provider"
import type {subTask} from "@/types"

const SubTaskCard = ({subtask}:{subtask:subTask}) => {

  const{isAdmin} = useAuth(state=>state);

  return (
    <li className={`
     ${(isAdmin && subtask.id % 3 === 0) && "bg-emerald-300"} 
      ${(isAdmin && subtask.id % 2 === 0) && "bg-red-300"} 
      ${(isAdmin && subtask.id % 1 === 0) && "bg-blue-300"} 
    group relative flex items-center justify-between p-1 rounded hover:bg-gray-100/50 transition-colors duration-200`}>
        <p className='text-sm text-gray-600 truncate pr-2'>
           • {subtask.content} 
        </p>
        <div className="absolute left-11/12 -bottom-5 -translate-y-1/2 z-10
            flex items-center justify-center
            h-6 bg-gray-200 text-gray-700 text-xs font-bold
            rounded-full shadow-md transition-all duration-300 ease-in-out
            w-6 group-hover:w-auto group-hover:px-3
            overflow-hidden whitespace-nowrap cursor-default select-none
          "
        >
          {subtask.content}
        </div>
    </li>
  )
}

export default SubTaskCard;