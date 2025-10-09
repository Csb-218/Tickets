import {Router} from "express";
import {createTask,updateTask,deleteTask,getTaskById,createSubtask,updateSubtask,deleteSubtask} from "../controllers/taskController"

const router = Router()

router.post("/",createTask)
router.get("/:id",getTaskById)
router.put("/:id",updateTask)
router.delete("/:id",deleteTask)

router.post("/:taskId/subtasks",createSubtask)
router.put("/:taskId/subtasks/:subtaskId",updateSubtask)
router.delete("/:taskId/subtasks/:subtaskId",deleteSubtask)

export default router;