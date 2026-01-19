import { Router } from "express";
import { createManager, getManager, updateManager } from "../controllers/managerControllers";

const router=Router();

// Add manager specific routes here
router.get('/:cognitoId',getManager);
router.post('/',createManager);
router.put('/:cognitoId', updateManager);


export default router;