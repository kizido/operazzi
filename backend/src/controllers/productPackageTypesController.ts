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
            throw createHttpError(404, "Product package type not found!");
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
    packageName?: string,
    packageLength?: number,
    packageWidth?: number,
    packageHeight?: number,
    packageWeight?: number,
}

export const createProductPackageType: RequestHandler<unknown, unknown, CreateProductPackageTypeBody, unknown> = async (req, res, next) => {
    const packageName = req.body.packageName;
    const packageLength = req.body.packageLength;
    const packageWidth = req.body.packageWidth;
    const packageHeight = req.body.packageHeight;
    const packageWeight = req.body.packageWeight;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!packageName) {
            throw createHttpError(400, "Must have a product package name!");
        }
        if (!packageLength) {
            throw createHttpError(400, "Must have a product package length!");
        }
        if (!packageWidth) {
            throw createHttpError(400, "Must have a product package width!");
        }
        if (!packageHeight) {
            throw createHttpError(400, "Must have a product package height!");
        }
        if (!packageWeight) {
            throw createHttpError(400, "Must have a product package weight!");
        }

        const newProductPackageType = await ProductPackageTypeModel.create({
            userId: authenticatedUserId,
            packageName: packageName,
            packageLength: packageLength,
            packageWidth: packageWidth,
            packageHeight: packageHeight,
            packageWeight: packageWeight,
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
    packageName?: string,
    packageLength?: number,
    packageWidth?: number,
    packageHeight?: number,
    packageWeight?: number,
}

export const updateProductPackageType: RequestHandler<UpdateProductPackageTypeParams, unknown, UpdateProductPackageTypeBody, unknown> = async (req, res, next) => {
    const productPackageTypeId = req.params.productPackageTypeId;
    const newPackageName = req.body.packageName;
    const newPackageLength = req.body.packageLength;
    const newPackageWidth = req.body.packageWidth;
    const newPackageHeight = req.body.packageHeight;
    const newPackageWeight = req.body.packageWeight;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productPackageTypeId)) {
            throw createHttpError(400, "Invalid product package type ID");
        }

        // Validate product body
        if (!newPackageName) {
            throw createHttpError(400, "PackageType must have a package type name!");
        }
        if (!newPackageLength) {
            throw createHttpError(400, "PackageType must have a package length!");
        }
        if (!newPackageWidth) {
            throw createHttpError(400, "PackageType must have a package width!");
        }
        if (!newPackageHeight) {
            throw createHttpError(400, "PackageType must have a package height!");
        }
        if (!newPackageWeight) {
            throw createHttpError(400, "PackageType must have a package weight!");
        }

        const productPackageType = await ProductPackageTypeModel.findById(productPackageTypeId).exec();

        if (!productPackageType) {
            throw createHttpError(404, "Product package type not found");
        }

        if (!productPackageType.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product package type");
        }

        productPackageType.packageName = newPackageName;
        productPackageType.packageLength = newPackageLength;
        productPackageType.packageWidth = newPackageWidth;
        productPackageType.packageHeight = newPackageHeight;
        productPackageType.packageWeight = newPackageWeight;

        const updatedProductPackageType = await productPackageType.save();
        res.status(200).json(updatedProductPackageType);
    } catch (error) {
        next(error);
    }
}