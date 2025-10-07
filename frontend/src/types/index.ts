import type { VariantProps } from 'class-variance-authority';
import { Badge } from "@/components/ui/badge"

export interface subTask {
    id:number
    content: string
    done: boolean
}


export interface Task{
    id:number
    title: string
    subtasks: subTask[]
        
}