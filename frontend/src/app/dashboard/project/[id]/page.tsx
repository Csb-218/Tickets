
'use client'
import type { VariantProps } from 'class-variance-authority';
import type { Task } from '@/types';
import { use } from 'react'
import { TableOfContents } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import  TaskCard from '@/components/custom/taskCard';

const Project = ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = use(params)
    console.log(id)

    // Define a type for the badge variant to ensure type safety
    type BadgeVariant = VariantProps<typeof Badge>['variant'];

    interface Section {
        title: string;
        variant?: BadgeVariant;
        badgeText?: string;
        badgeClassName?: string;
        tasks: Task[];
    }


    const sections:Section[] = [
        {
            title: 'Proposed',
            variant: 'secondary' as BadgeVariant,
            badgeClassName: "bg-[#FDDBF6] text-[#702C61]",
            tasks: [
                { id:1 , 
                  title: 'Brainstorm new feature ideas' ,
                  subtasks:[
                    {
                        id:1,
                        content:"Research crypto trends",
                        done:false
                    },
                    {
                        id:2,
                        content:"Research AI trends",
                        done:false
                    },
                    {
                        id:3,
                        content:"Research Quantum trends",
                        done:false
                    }

                  ]
                
                }
            ]
        },
        {
            title: 'Todo',
            variant: 'secondary' as BadgeVariant,
            badgeClassName: "bg-[#E9DFFF] text-[#483473]",
            tasks: []
        },
        {
            title: 'Inprogress',
            badgeText: 'In progress',
            variant: 'secondary' as BadgeVariant,
            badgeClassName: "bg-[#CCF9FF] text-[#0E6874]",
            tasks: []
        },
        {
            title: 'Done',
            variant: 'secondary' as BadgeVariant,
            badgeClassName: "bg-[#D0F8E9] text-[#166747]",
            tasks: []
        },
        {
            title: 'Deployed',
            variant: 'outline' as BadgeVariant,
            badgeClassName: "bg-[#ebebeb] text-[#999999]",
            tasks: []
        }
    ]

    return (
        <div className="container mx-auto border-[1px] rounded-sm bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex items-center py-1 px-4 bg-white border-b-[1px]">
                <TableOfContents size={16} />
                <h1 className="text-lg text-gray-800"> All </h1>
            </header>

            {/* Main Body with 5 dynamic horizontal sections */}
            <main className="flex flex-row h-full">
                {
                    sections.map((section, index) =>
                        <section key={section.title} className={`${index !== (sections.length - 1) ? 'border-r border-gray-200' : ''} p-3 flex-1 bg-gray-50`}>
                            <div className="mb-4">
                                <Badge variant={section.variant} className={section.badgeClassName}>
                                    {section.badgeText || section.title}
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                {section.tasks.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </section>
                    )
                }


            </main>
        </div>
    )
}

export default Project;