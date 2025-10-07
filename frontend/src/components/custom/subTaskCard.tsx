import React from 'react'
import type {subTask} from "@/types"

const SubTaskCard = ({subtask}:{subtask:subTask}) => {

  return (
    <li className='p-1 bg-amber-300 rounded'>
        <p className='text-sm text-gray-600'>
           • {subtask.content} 
        </p> 
    </li>
  )
}

export default SubTaskCard;