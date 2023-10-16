import { RequestHandler } from "express";
import ProductBrandModel from "../models/productBrand";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getProductBrands: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const productBrands = await ProductBrandModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(productBrands);
    } catch (error) {
        next(error);
    }
};

export const getProductBrand: RequestHandler = async (req, res, next) => {
    const productBrandId = req.params.productBrandId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productBrandId)) {
            throw createHttpError(400, "Invalid product brand ID");
        }

        const productBrand = await ProductBrandModel.findById(productBrandId).exec();

        if (!productBrand) {
            throw createHttpError(404, "Product brand not found!");
        }

        if (!productBrand.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product brand");
        }

        res.status(200).json(productBrand);
    } catch (error) {
        next(error);
    }
};

interface CreateProductBrandBody {
    brand?: string,
}

export const createProductBrand: RequestHandler<unknown, unknown, CreateProductBrandBody, unknown> = async (req, res, next) => {
    const brand = req.body.brand;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!brand) {
            throw createHttpError(400, "Must have a product brand!");
        }

        const newProductBrand = await ProductBrandModel.create({
            userId: authenticatedUserId,
            brand: brand,
        });

        res.status(201).json(newProductBrand);
    } catch (error) {
        next(error);
    }
};