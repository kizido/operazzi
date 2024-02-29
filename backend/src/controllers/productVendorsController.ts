import { RequestHandler } from "express";
import ProductVendorModel from "../models/productVendor";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getProductVendors: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const productVendors = await ProductVendorModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(productVendors);
    } catch (error) {
        next(error);
    }
};

export const getProductVendor: RequestHandler = async (req, res, next) => {
    const productVendorId = req.params.productVendorId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productVendorId)) {
            throw createHttpError(400, "Invalid product vendor ID");
        }

        const productVendor = await ProductVendorModel.findById(productVendorId).exec();

        if (!productVendor) {
            throw createHttpError(404, "Product vendor not found!");
        }

        if (!productVendor.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product vendor");
        }

        res.status(200).json(productVendor);
    } catch (error) {
        next(error);
    }
};

export const createProductVendor: RequestHandler<unknown, unknown, string, unknown> = async (req, res, next) => {
    const vendor = req.body; // IF NO WORK, change this to req.body.vendor and create a model
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!vendor) {
            throw createHttpError(400, "Must have a product vendor!");
        }

        const newProductVendor = await ProductVendorModel.create({
            userId: authenticatedUserId,
            vendor,
        });

        res.status(201).json(newProductVendor);
    } catch (error) {
        next(error);
    }
};

export const deleteProductVendor: RequestHandler = async (req, res, next) => {
    const productVendorId = req.params.productVendorId;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(productVendorId)) {
            throw createHttpError(400, "Invalid product vendor id");
        }
        const productVendor = await ProductVendorModel.findById(productVendorId).exec();

        if (!productVendor) {
            throw createHttpError(404, "Product vendor not found");
        }

        if (!productVendor.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product vendor");
        }

        await productVendor.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}

interface UpdateProductVendorParams {
    productVendorId: string,
}
interface UpdateProductVendorBody {
    vendor?: string,
}

export const updateProductVendor: RequestHandler<UpdateProductVendorParams, unknown, UpdateProductVendorBody, unknown> = async (req, res, next) => {
    const productVendorId = req.params.productVendorId;
    const newVendor = req.body.vendor;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productVendorId)) {
            throw createHttpError(400, "Invalid product vendor ID");
        }

        // Validate product body
        if (!newVendor) {
            throw createHttpError(400, "Vendor must have a vendor name!");
        }

        const productVendor = await ProductVendorModel.findById(productVendorId).exec();

        if (!productVendor) {
            throw createHttpError(404, "Product vendor not found");
        }

        if (!productVendor.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product vendor");
        }

        productVendor.vendor = newVendor;

        const updatedProductVendor = await productVendor.save();
        res.status(200).json(updatedProductVendor);
    } catch (error) {
        next(error);
    }
}