import { PrismaClient } from '../prisma/generated/prisma';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

/**
 * Creates a new project.
 * When a project is created, it also creates default lists (Todo, In Progress, Done)
 * and adds the owner as an ADMIN member.
 */
export const createProject = async (req: Request, res: Response) => {
  const { name, description, ownerId } = req.body;

  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Project name and ownerId are required.' });
  }

  try {
    // Check if the owner exists
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found.' });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        ownerId,
        // Create the project owner as a member with ADMIN role
        members: {
          create: {
            userId: ownerId,
            role: 'ADMIN',
          },
        },
        // Create default lists for the new project
        lists: {
          create: [
            { name: 'Todo', order: 1 },
            { name: 'In Progress', order: 2 },
            { name: 'Done', order: 3 },
          ],
        },
      },
      include: {
        members: true,
        lists: true,
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Failed to create project:', error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

/**
 * Fetches all projects.
 * In a real application, this should be scoped to the user's memberships.
 */
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    // For a real app, you'd get the userId from auth and filter:
    // where: { members: { some: { userId: currentUserId } } }
    const projects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { members: true, tasks: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Failed to get projects:', error);
    res.status(500).json({ error: 'Failed to get projects.' });
  }
};

/**
 * Fetches a single project by its ID.
 */
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        members: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
        lists: { orderBy: { order: 'asc' } },
        tasks: { take: 10, orderBy: { createdAt: 'desc' } }, // Include recent tasks
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(`Failed to get project ${id}:`, error);
    res.status(500).json({ error: 'Failed to get project.' });
  }
};

/**
 * Updates a project's details.
 */
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    // In a real app, you'd check if the user has ADMIN role for this project.
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name, description },
    });
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    res.status(500).json({ error: 'Failed to update project.' });
  }
};

/**
 * Deletes a project.
 * This is a hard delete and uses a transaction to remove all related data.
 */
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // In a real app, you'd check if the user is the project owner.
    await prisma.$transaction([
      // Delete all related records first to avoid foreign key constraints
      prisma.comment.deleteMany({ where: { task: { projectId: id } } }),
      prisma.subtask.deleteMany({ where: { task: { projectId: id } } }),
      prisma.task.deleteMany({ where: { projectId: id } }),
      prisma.list.deleteMany({ where: { projectId: id } }),
      prisma.projectMember.deleteMany({ where: { projectId: id } }),
      prisma.activityLog.deleteMany({ where: { projectId: id } }),
      // Finally, delete the project itself
      prisma.project.delete({ where: { id } }),
    ]);

    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
};