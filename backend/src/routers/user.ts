import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

// Chained routes for better organization

// Routes for /api/users
router.route('/')
  .get(getAllUsers)
  .post(createUser);

// Routes for /api/users/:id
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;