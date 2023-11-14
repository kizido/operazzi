import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import ProductCustomsModel from '../models/productCustoms';
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getProductsCustoms: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const productsCustoms = await ProductCustomsModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(productsCustoms);
    }
    catch (error) {
        next(error);
    }
};

export const getProductCustoms: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const productCustomsId = req.params.productCustomsId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productCustomsId)) {
            throw createHttpError(400, "Invalid product customs ID");
        }

        const productCustoms = await ProductCustomsModel.findById(productCustomsId).exec();

        if (!productCustoms) {
            throw createHttpError(404, "Product customs not found!");
        }

        if (!productCustoms.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product");
        }

        res.status(200).json(productCustoms);
    } catch (error) {
        next(error);
    }
};

// interface CreateProductCustomsBody {
//     customsDeclaration?: boolean,
//     itemDescription?: string,
//     harmonizationCode?: string,
//     countryOrigin?: string,
//     declaredValue?: number,
// }

// export const createProductCustoms: RequestHandler<unknown, unknown, CreateProductCustomsBody, unknown> = async (req, res, next) => {
//     const customsDeclaration = req.body.customsDeclaration;
//     const itemDescription = req.body.itemDescription;
//     const harmonizationCode = req.body.harmonizationCode;
//     const countryOrigin = req.body.countryOrigin;
//     const declaredValue = req.body.declaredValue;
//     const authenticatedUserId = req.session.userId;

//     try {
//         assertIsDefined(authenticatedUserId)

//         const newProductCustoms = await ProductCustomsModel.create({
//             userId: authenticatedUserId,
//             customsDeclaration: customsDeclaration,
//             itemDescription: itemDescription,
//             harmonizationCode: harmonizationCode,
//             countryOrigin: countryOrigin,
//             declaredValue: declaredValue,
//         })

//         res.status(201).json(newProductCustoms)
//     } catch (error) {
//         next(error);
//     }
// }

interface UpdateProductCustomsParams {
    productCustomsId: string,
}

interface UpdateProductCustomsBody {
    customsDeclaration?: boolean,
    itemDescription?: string,
    harmonizationCode?: string,
    countryOrigin?: string,
    declaredValue?: number,
}

export const updateProductCustoms: RequestHandler<UpdateProductCustomsParams, unknown, UpdateProductCustomsBody, unknown> = async (req, res, next) => {
    const productCustomsId = req.params.productCustomsId;
    const newCustomsDeclaration = req.body.customsDeclaration;
    const newItemDescription = req.body.itemDescription;
    const newHarmonizationCode = req.body.harmonizationCode;
    const newCountryOrigin = req.body.countryOrigin;
    const newDeclaredValue = req.body.declaredValue;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productCustomsId)) {
            throw createHttpError(400, "Invalid product customs ID");
        }

        if (!newCustomsDeclaration) {
            throw createHttpError(400, "Product customs must have a customs declaration");
        }
        if (!newItemDescription) {
            throw createHttpError(400, "Product customs must have an item description");
        }
        if (!newHarmonizationCode) {
            throw createHttpError(400, "Product customs must have a harmonization code");
        }
        if (!newCountryOrigin) {
            throw createHttpError(400, "Product customs must have a country origin");
        }
        if (!newDeclaredValue) {
            throw createHttpError(400, "Product customs must have a declared value");
        }

        const productCustoms = await ProductCustomsModel.findById(productCustomsId).exec();

        if (!productCustoms) {
            throw createHttpError(404, "Product customs not found");
        }

        if (!productCustoms.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product");
        }

        productCustoms.customsDeclaration = newCustomsDeclaration;
        productCustoms.itemDescription = newItemDescription;
        productCustoms.harmonizationCode = newHarmonizationCode;
        productCustoms.countryOrigin = newCountryOrigin;
        productCustoms.declaredValue = newDeclaredValue;

        const updatedProductCustoms = await productCustoms.save();
        res.status(200).json(updatedProductCustoms);
    } catch (error) {
        next(error);
    }
}