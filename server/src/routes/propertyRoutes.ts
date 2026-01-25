import { Router } from "express";
import {getProperty,createProperties ,getAllProperties} from "../controllers/propertyControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
const router = Router();

const storage= multer.memoryStorage();
const upload= multer({storage:storage});

router.get('/:id',getProperty);
router.post("/",
    authMiddleware(['manager']),
    upload.array('photos'),
    createProperties);
router.get("/",getAllProperties);
export default router;