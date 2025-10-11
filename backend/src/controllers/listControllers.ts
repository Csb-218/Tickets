import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';

const prisma = new PrismaClient();
/**
 * @description Create a new list
 * @route POST /api/lists
 * @access Private
 */
export const createList = async (req: Request, res: Response) => {
  try {
    const { name, projectId } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({ message: 'Name and projectId are required' });
    }

    // Find the highest order value for the lists in the project to append the new list
    const listCount = await prisma.list.count({
      where: { projectId },
    });

    // Optional: Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ message: `Project with ID ${projectId} not found` });
    }


    const newList = await prisma.list.create({
      data: {
        name,
        projectId,
        order: listCount, // Set order as the next available index
      },
    });

    res.status(201).json(newList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error creating list' });
  }
};

/**
 * @description Get all lists for a specific project
 * @route GET /api/lists/project/:projectId
 * @access Private
 */
export const getListsByProjectId = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const lists = await prisma.list.findMany({
      where: {
        projectId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.status(200).json(lists);
  } catch (error) {
    console.error('Error fetching lists by project ID:', error);
    res.status(500).json({ message: 'Server error fetching lists' });
  }
};

/**
 * @description Get a single list by its ID, including its tasks and their subtasks
 * @route GET /api/lists/:id
 * @access Private
 */
export const getListById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.findUnique({
      where: {
        id,
      },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
          include: {
            subtasks: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json(list);
  } catch (error) {
    console.error('Error fetching list by ID:', error);
    res.status(500).json({ message: 'Server error fetching list' });
  }
};

/**
 * @description Update a list's details (e.g., title)
 * @route PUT /api/lists/:id
 * @access Private
 */
export const updateList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    const list = await prisma.list.findUnique({ where: { id } });

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const updatedList = await prisma.list.update({
      where: {
        id,
      },
      data: {
        name: name || list.name,
        order: order !== undefined ? order : list.order,
      },
    });

    res.status(200).json(updatedList);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Server error updating list' });
  }
};

/**
 * @description Delete a list
 * @route DELETE /api/lists/:id
 * @access Private
 */
export const deleteList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = await prisma.list.findUnique({ where: { id } });

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    await prisma.list.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: 'List and all its tasks have been deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Server error deleting list' });
  }
};