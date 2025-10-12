import type { VariantProps } from 'class-variance-authority';
import { Badge } from "@/components/ui/badge"

export interface Project{
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: User;
}

export type ProjectDetails = Project & {
    members: ProjectMember[];
    lists: (TaskList & { tasks: Task[] })[];
};

export type Role = "ADMIN" | "MEMBER";

export interface ProjectMember {
    id: string;
    userId: string;
    projectId: string;
    role: Role;
    joinedAt: string;
    user: User;
}

export interface User {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}

export interface TaskList {
    id: string;
    name: string;
    order: number;
    projectId: string;
}

export type TaskStatus = "Todo" | "In Progress" | "Done";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskWithSubtasks = Task & { subtasks: Subtask[] };

export interface Task {
    id: string;
    title: string;
    description: string | null;
    order: number;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
    listId: string;
    projectId: string;
    createdById: string;
    assignedToId: string;
    subtasks: Subtask[];
}

export interface Subtask {
    id: string;
    title: string;
    isDone: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    taskId: string;
    assigneeId: string | null;
    assignerId: string | null;
    assigner: User | null
    assignee: User | null

}