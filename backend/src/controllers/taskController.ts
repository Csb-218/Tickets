import { PrismaClient } from '../../prisma/generated/prisma';
import type { Request, Response } from 'express';
// import redis from '../lib/redisClient';

const prisma = new PrismaClient();

// --- Task Controllers ---

/**
 * Creates a new task within a project and list.
 */
export const createTask = async (req: Request, res: Response) => {
  const { title, listId, projectId, createdById, description, priority, dueDate, assignedToId } = req.body;

  if (!title || !listId || !projectId || !createdById) {
    return res.status(400).json({ error: 'Title, listId, projectId, and createdById are required.' });
  }

  try {
    // Get the highest order in the list to append the new task
    const maxOrder = await prisma.task.aggregate({
      _max: { order: true },
      where: { listId },
    });

    const newOrder = (maxOrder._max.order ?? 0) + 1;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        listId,
        projectId,
        createdById,
        assignedToId,
        priority,
        dueDate,
        order: newOrder,
        status: 'Todo', // Default status
      },
    });

    // Optional: Create an activity log
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'TASK',
        entityId: newTask.id,
        projectId,
        userId: createdById,
        metadata: { title: newTask.title },
      },
    });

    res.status(201).json(newTask);
    // redis.lpush(newTask.id, JSON.stringify(newTask))
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

/**
 * Fetches a single task by its ID, including related data.
 */
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true } },
        assignedTo: { select: { id: true, name: true, avatarUrl: true } },
        comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
        subtasks: { orderBy: { order: 'asc' } },
        list: true,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(`Failed to get task ${id}:`, error);
    res.status(500).json({ error: 'Failed to get task.' });
  }
};

/**
 * Updates a task's details.
 * Note: A full implementation for reordering (`order`, `listId`) would be more complex.
 */
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Assuming userId comes from auth middleware
  const { userId, ...dataToUpdate } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...dataToUpdate,
        version: { increment: 1 }, // Optimistic concurrency control
      },
    });

    // Optional: Create an activity log for the update
    // You might want to log what exactly changed.
    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'TASK',
        entityId: updatedTask.id,
        projectId: updatedTask.projectId,
        userId: userId || updatedTask.createdById, // Fallback, should be from auth
        metadata: { updatedFields: Object.keys(dataToUpdate) },
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

/**
 * Deletes a task and its related comments and subtasks in a transaction.
 */
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { taskId: id } }),
      prisma.subtask.deleteMany({ where: { taskId: id } }),
      prisma.task.delete({ where: { id } }),
    ]);
    res.status(204).send();
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};

// --- Subtask Controllers ---

/**
 * Creates a new subtask for a given task.
 */
export const createSubtask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Subtask title is required.' });
  }

  try {
    const maxOrder = await prisma.subtask.aggregate({
      _max: { order: true },
      where: { taskId },
    });

    const newOrder = (maxOrder._max.order ?? 0) + 1;

    const newSubtask = await prisma.subtask.create({
      data: {
        title,
        taskId,
        order: newOrder,
      },
    });
    res.status(201).json(newSubtask);
  } catch (error) {
    console.error(`Failed to create subtask for task ${taskId}:`, error);
    res.status(500).json({ error: 'Failed to create subtask.' });
  }
};

/**
 * Updates a subtask (e.g., marks as done, changes title).
 */
export const updateSubtask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, isDone, assigneeId } = req.body;

  try {
    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: { title, isDone, assigneeId },
    });
    res.status(200).json(updatedSubtask);
  } catch (error) {
    console.error(`Failed to update subtask ${id}:`, error);
    res.status(500).json({ error: 'Failed to update subtask.' });
  }
};

/**
 * Deletes a subtask.
 */
export const deleteSubtask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.subtask.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(`Failed to delete subtask ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete subtask.' });
  }
};