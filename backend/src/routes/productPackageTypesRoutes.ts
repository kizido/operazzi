import express from "express";
import * as ProductPackageTypesController from "../controllers/productPackageTypesController";

const router = express.Router();

router.get("/", ProductPackageTypesController.getProductPackageTypes);
router.get("/:productPackageTypeId", ProductPackageTypesController.getProductPackageType);
router.post("/", ProductPackageTypesController.createProductPackageType);

export default router;