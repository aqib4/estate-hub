import { Router } from "express";
import { addFavouriteProperty, createTenant, getCurrentResidency, getTenant, updateTenant} from "../controllers/tenantControllers";
const router = Router();

router.get('/:cognitoId',getTenant);
router.put('/:cognitoId',updateTenant);
router.post("/",createTenant);
router.get("/:cognitoId/get-residence",getCurrentResidency);
router.post("/:cognitoId/favouriteProperty/:propertyId",addFavouriteProperty);
router.delete("/:cognitoId/favouriteProperty/:propertyId",addFavouriteProperty);
router.get("/me",(req,res)=>{res.send("Tenant route working")});

export default router;