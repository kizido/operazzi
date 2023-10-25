import express from "express";
import * as ProductBrandsController from "../controllers/productBrandsController";

const router = express.Router();

router.get("/", ProductBrandsController.getProductBrands);
router.get("/:productBrandId", ProductBrandsController.getProductBrand);
router.post("/", ProductBrandsController.createProductBrand);
router.delete("/:productBrandId", ProductBrandsController.deleteProductBrand);
router.patch("/:productBrandId", ProductBrandsController.updateProductBrand);

export default router;