import express from "express";
import * as ProductVendorsController from "../controllers/productVendorsController";

const router = express.Router();

router.get("/", ProductVendorsController.getProductVendors);
router.get("/:productVendorId", ProductVendorsController.getProductVendor);
router.post("/", ProductVendorsController.createProductVendor);
router.patch("/:productVendorId", ProductVendorsController.updateProductVendor);
router.delete("/:productVendorId", ProductVendorsController.deleteProductVendor);

export default router;