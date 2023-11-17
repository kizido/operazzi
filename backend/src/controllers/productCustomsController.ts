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

interface UpdateProductCustomsParams {
    productCustomsId: string,
}

interface UpdateProductCustomsBody {
    customsDeclaration?: boolean,
    itemDescription?: string,
    harmonizationCode?: string,
    countryOrigin?: string,
    declaredValue?: string,
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