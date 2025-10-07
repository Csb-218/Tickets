import React from 'react'
import type { Task } from "@/types"
import SubTaskCard from './subTaskCard';

interface TaskCardProps {
    task: Task;
}
const TaskCard = ({ task }: TaskCardProps) => {
    return (
        <div>
            <div className="space-y-3">

                <div key={task.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-700">{task.title}</p>
                    {/* subtasks */}
                    
                        <ul className='space-y-1'>
                            {
                                task.subtasks.map(subtask => (
                                    <SubTaskCard key={subtask.id} subtask={subtask} />
                                ))
                            }
                        </ul>

                </div>

            </div>
        </div>
    )
}

export default TaskCard;
