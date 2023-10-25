import { RequestHandler } from "express";
import ProductPackageTypeModel from "../models/productPackageType";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getProductPackageTypes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const productPackageTypes = await ProductPackageTypeModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(productPackageTypes);
    } catch (error) {
        next(error);
    }
};

export const getProductPackageType: RequestHandler = async (req, res, next) => {
    const productPackageTypeId = req.params.productPackageTypeId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productPackageTypeId)) {
            throw createHttpError(400, "Invalid product packageType ID");
        }

        const productPackageType = await ProductPackageTypeModel.findById(productPackageTypeId).exec();

        if (!productPackageType) {
            throw createHttpError(404, "Product packageType not found!");
        }

        if (!productPackageType.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product packageType");
        }

        res.status(200).json(productPackageType);
    } catch (error) {
        next(error);
    }
};

interface CreateProductPackageTypeBody {
    packageType?: string,
}

export const createProductPackageType: RequestHandler<unknown, unknown, CreateProductPackageTypeBody, unknown> = async (req, res, next) => {
    const packageType = req.body.packageType;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!packageType) {
            throw createHttpError(400, "Must have a product packageType!");
        }

        const newProductPackageType = await ProductPackageTypeModel.create({
            userId: authenticatedUserId,
            packageType: packageType,
        });

        res.status(201).json(newProductPackageType);
    } catch (error) {
        next(error);
    }
};

export const deleteProductPackageType: RequestHandler = async (req, res, next) => {
    const productPackageTypeId = req.params.productPackageTypeId;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(productPackageTypeId)) {
            throw createHttpError(400, "Invalid product package type id");
        }
        const productPackageType = await ProductPackageTypeModel.findById(productPackageTypeId).exec();

        if (!productPackageType) {
            throw createHttpError(404, "Product package type not found");
        }

        if (!productPackageType.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product package type");
        }

        await productPackageType.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}

interface UpdateProductPackageTypeParams {
    productPackageTypeId: string,
}
interface UpdateProductPackageTypeBody {
    packageType?: string,
}

export const updateProductPackageType: RequestHandler<UpdateProductPackageTypeParams, unknown, UpdateProductPackageTypeBody, unknown> = async (req, res, next) => {
    const productPackageTypeId = req.params.productPackageTypeId;
    const newPackageType = req.body.packageType;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productPackageTypeId)) {
            throw createHttpError(400, "Invalid product package type ID");
        }

        // Validate product body
        if (!newPackageType) {
            throw createHttpError(400, "PackageType must have a package type name!");
        }

        const productPackageType = await ProductPackageTypeModel.findById(productPackageTypeId).exec();

        if (!productPackageType) {
            throw createHttpError(404, "Product package type not found");
        }

        if (!productPackageType.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product package type");
        }

        productPackageType.packageType = newPackageType;

        const updatedProductPackageType = await productPackageType.save();
        res.status(200).json(updatedProductPackageType);
    } catch (error) {
        next(error);
    }
}