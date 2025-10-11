import {createList,getListById,updateList,deleteList,getListsByProjectId} from "../controllers/listControllers"
import {Router} from "express"

const router = Router()

router.post("/",createList)
router.get("/:id",getListById)
router.put("/:id",updateList)
router.delete("/:id",deleteList)

export default router;