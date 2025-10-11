import {Router} from "express"
import {createProject,getAllProjects,getProjectById,updateProject,deleteProject,getProjectWithBoard} from "../controllers/projectController"

const router = Router()

router.post("/",createProject)
router.get("/",getAllProjects)
router.get("/:id",getProjectWithBoard)
router.put("/:id",updateProject)
router.delete("/:id",deleteProject)

export default router;