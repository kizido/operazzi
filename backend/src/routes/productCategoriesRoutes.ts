import express from "express";
import * as ProductCategoriesController from "../controllers/productCategoriesController";

const router = express.Router();

router.get("/", ProductCategoriesController.getProductCategories);
router.get("/:productCategoryId", ProductCategoriesController.getProductCategory);
router.post("/", ProductCategoriesController.createProductCategory);
router.delete("/:productCategoryId", ProductCategoriesController.deleteProductCategory);
router.patch("/:productCategoryId", ProductCategoriesController.updateProductCategory);


export default router;