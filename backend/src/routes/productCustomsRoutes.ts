import express from "express";
import * as ProductCustomsController from "../controllers/productCustomsController";

const router = express.Router();

router.get("/", ProductCustomsController.getProductsCustoms);
router.get("/:productCustomsId", ProductCustomsController.getProductCustoms);
router.patch("/:productCustomsId", ProductCustomsController.updateProductCustoms);

export default router;