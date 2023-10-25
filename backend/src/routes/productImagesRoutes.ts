import express from 'express';
import * as ProductImagesController from '../controllers/productImagesController'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", ProductImagesController.getProductImages);
router.get("/:productImageId", ProductImagesController.getProductImage);
router.post("/", upload.single('imageFile'), ProductImagesController.createProductImage)

export default router;