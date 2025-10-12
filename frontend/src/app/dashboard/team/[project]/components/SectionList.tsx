"use client"

import React,{useState} from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { Task } from '@/types';

import { Badge } from "@/components/ui/badge";
import TaskCard from '@/app/dashboard/team/[project]/components/taskCard';
import AddTaskForm from '@/app/dashboard/team/[project]/components/addTaskForm';
import { Button } from '@/components/ui/button';



type SectionListProps = {
  section: Section;
  index: number;
  lists: Section[];
};

 type BadgeVariant = VariantProps<typeof Badge>['variant'];

 type Section =   {
        title: string;
        variant?: BadgeVariant;
        badgeText?: string;
        badgeClassName?: string;
        tasks: Task[];
 }

const SectionList : React.FC<SectionListProps>  = ({ section, index, lists }) => {


     const [taskform, setTaskForm] = useState<number | null>(null)

  return (
     <section className={`${index !== (lists.length - 1) ? 'border-r border-gray-200' : ''} p-3 w-64 flex-shrink-0 bg-gray-50`}>
            <div className="mb-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-start gap-x-2">
                    <Badge variant={section.variant} className={section.badgeClassName}>
                        {section.badgeText || section.title}
                    </Badge>
                    <p className="text-sm text-stone-400 font-light">{section.tasks.length}</p>
                </div>
                <Button
                    onClick={() => setTaskForm(index)}
                    type='button'
                    variant="ghost"
                    size={"sm"}
                    className="w-fit text-stone-400 font-light">
                    + New
                </Button>
            </div>
            <div className="space-y-3">
                {taskform === index && <AddTaskForm setTaskForm={setTaskForm} />}
                {section.tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </section>
  )
}

export default SectionList