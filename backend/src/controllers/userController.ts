import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';

const prisma = new PrismaClient();

/**
 * @description Get all users
 * @route GET /api/users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        projects: true,
        memberships: true,
        assignedTasks: true,
        createdTasks: true,
      },
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

/**
 * @description Get a single user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
        memberships: true,
        assignedTasks: true,
        createdTasks: true,
        assignedSubtasks: true,
        createdSubtask: true,
        comments: true,
        notifications: true,
        activityLogs: true,
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

/**
 * @description Create a new user
 * @route POST /api/users
 */
export const createUser = async (req: Request, res: Response) => {
  const { id , email, name, avatarUrl, isSuperUser, meta } = req.body;

  // Check for required fields. Assuming 'name' was intended instead of 'id' for creation.
  if (!email || !id) {
    return res.status(400).json({ error: 'Email and id are required.' });
  }

  try {
    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = await prisma.user.create({
      data: { id ,email, name, avatarUrl, isSuperUser, meta }
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
};

/**
 * @description Update a user by ID
 * @route PUT /api/users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    // Scalar fields
    email,
    name,
    avatarUrl,
    isSuperUser,
    meta,
    lastSeen,
    // Relational fields for update
    projects,
    memberships,
    assignedTasks,
    createdTasks,
    assignedSubtasks,
    createdSubtask,
    comments,
    notifications,
    activityLogs,
  } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        avatarUrl,
        isSuperUser,
        meta,
        lastSeen,
        // Connect/disconnect/set relations based on provided IDs
        projects: projects ? { set: projects } : undefined,
        memberships: memberships ? { set: memberships } : undefined,
        assignedTasks: assignedTasks ? { set: assignedTasks } : undefined,
        createdTasks: createdTasks ? { set: createdTasks } : undefined,
        assignedSubtasks: assignedSubtasks ? { set: assignedSubtasks } : undefined,
        createdSubtask: createdSubtask ? { set: createdSubtask } : undefined,
        comments: comments ? { set: comments } : undefined,
        notifications: notifications ? { set: notifications } : undefined,
        activityLogs: activityLogs ? { set: activityLogs } : undefined,
      },
      include: {
        projects: true,
        memberships: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

/**
 * @description Delete a user by ID
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};