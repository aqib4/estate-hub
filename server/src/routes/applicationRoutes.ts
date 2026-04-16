import { Router } from "express"; 
import { listApplications,createApplication, updateApplicationStatus } from "../controllers/applicationControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/",authMiddleware(['manager','tenant']), listApplications);
router.post("/",authMiddleware(['tenant']),createApplication);
router.put("/:id/sstatus",authMiddleware(['manager']),updateApplicationStatus);

export default router;  