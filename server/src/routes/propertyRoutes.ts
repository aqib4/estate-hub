import { Router } from "express";
import {getProperty,createProperty ,getAllProperties} from "../controllers/propertyControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
const router = Router();

const storage= multer.memoryStorage();
const upload= multer({storage:storage});

router.get('/:id',getProperty);
router.post("/",
    authMiddleware(['manager']),
    upload.array('photos'),
    createProperty);
router.get("/",getAllProperties);
export default router;