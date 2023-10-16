import express from "express";
import * as ProductCategoriesController from "../controllers/productCategoriesController";

const router = express.Router();

router.get("/", ProductCategoriesController.getProductCategories);
router.get("/:productCategoryId", ProductCategoriesController.getProductCategory);
router.post("/", ProductCategoriesController.createProductCategory);
router.delete("/:produtCategoryId", ProductCategoriesController.deleteProductCategory);


export default router;