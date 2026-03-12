import { Router } from "express";
import { getLeasePayments, getLeases } from "../controllers/leaseControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router= Router();

router.get('/',authMiddleware(['tenant','manager']),getLeases);
router.get('/:id/payments',authMiddleware(['manager','tenant']),getLeasePayments);

export default router;