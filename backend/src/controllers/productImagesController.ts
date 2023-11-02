import { RequestHandler } from "express";
import ProductImageModel from "../models/productImage";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getProductImages: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const productImages = await ProductImageModel.find({ userId: authenticatedUserId }).exec();
        const productImagesBase64 = productImages.map((img) => {
            return {
                _id: img._id,
                fileName: img.fileName,
                imageFileBase64: img.imageBuffer.toString('base64'),
                contentType: img.contentType,
                createdAt: img.createdAt,
                updatedAt: img.updatedAt,
            }
        })
        res.status(200).json(productImagesBase64);
    } catch (error) {
        next(error);
    }
};

export const getProductImage: RequestHandler = async (req, res, next) => {
    const productImageId = req.params.productImageId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productImageId)) {
            throw createHttpError(400, "Invalid product image ID");
        }

        const productImage = await ProductImageModel.findById(productImageId).exec();

        if (!productImage) {
            throw createHttpError(404, "Product image not found!");
        }

        const productImageBase64 = {
            _id: productImage._id,
            fileName: productImage.fileName,
            imageFileBase64: productImage.imageBuffer.toString('base64'),
            contentType: productImage.contentType,
            createdAt: productImage.createdAt,
            updatedAt: productImage.updatedAt,
        };

        if (!productImage.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product image");
        }

        res.status(200).json(productImageBase64);
    } catch (error) {
        next(error);
    }
}

interface CreateProductImageBody {
    name?: string,
    imageFile?: Buffer,
    contentType?: string,
}

export const createProductImage: RequestHandler<unknown, unknown, CreateProductImageBody, unknown> = async (req, res, next) => {
    const fileName = req.file?.originalname;
    const imageBuffer = req.file?.buffer;
    const contentType = req.file?.mimetype;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const newProductImage = await ProductImageModel.create({
            userId: authenticatedUserId,
            fileName: fileName,
            imageBuffer: imageBuffer,
            contentType: contentType,

        });
        const newProductImageBase64 = {
            _id: newProductImage._id,
            fileName: newProductImage.fileName,
            imageFileBase64: newProductImage.imageBuffer.toString('base64'),
            contentType: newProductImage.contentType,
            createdAt: newProductImage.createdAt,
            updatedAt: newProductImage.updatedAt,
        }

        res.status(201).json(newProductImageBase64);
    } catch (error) {
        next(error);
    }
};