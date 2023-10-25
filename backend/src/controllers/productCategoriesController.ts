import { RequestHandler } from "express";
import ProductCategoryModel from "../models/productCategory";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getProductCategories: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const productCategories = await ProductCategoryModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(productCategories);
    } catch (error) {
        next(error);
    }
};

export const getProductCategory: RequestHandler = async (req, res, next) => {
    const productCategoryId = req.params.productCategoryId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productCategoryId)) {
            throw createHttpError(400, "Invalid product category ID");
        }

        const productCategory = await ProductCategoryModel.findById(productCategoryId).exec();

        if (!productCategory) {
            throw createHttpError(404, "Product category not found!");
        }

        if (!productCategory.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product category");
        }

        res.status(200).json(productCategory);
    } catch (error) {
        next(error);
    }
};

interface CreateProductCategoryBody {
    category?: string,
}

export const createProductCategory: RequestHandler<unknown, unknown, CreateProductCategoryBody, unknown> = async (req, res, next) => {
    const category = req.body.category;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!category) {
            throw createHttpError(400, "Must have a product category!");
        }

        const newProductCategory = await ProductCategoryModel.create({
            userId: authenticatedUserId,
            category: category,
        });

        res.status(201).json(newProductCategory);
    } catch (error) {
        next(error);
    }
};

export const deleteProductCategory: RequestHandler = async (req, res, next) => {
    const productCategoryId = req.params.productCategoryId;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(productCategoryId)) {
            throw createHttpError(400, "Invalid product category id");
        }
        const productCategory = await ProductCategoryModel.findById(productCategoryId).exec();

        if (!productCategory) {
            throw createHttpError(404, "Product category not found");
        }

        if (!productCategory.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product category");
        }

        await productCategory.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}

interface UpdateProductCategoryParams {
    productCategoryId: string,
}
interface UpdateProductCategoryBody {
    category?: string,
}

export const updateProductCategory: RequestHandler<UpdateProductCategoryParams, unknown, UpdateProductCategoryBody, unknown> = async (req, res, next) => {
    const productCategoryId = req.params.productCategoryId;
    const newCategory = req.body.category;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productCategoryId)) {
            throw createHttpError(400, "Invalid product category ID");
        }

        // Validate product body
        if (!newCategory) {
            throw createHttpError(400, "Category must have a category name!");
        }

        const productCategory = await ProductCategoryModel.findById(productCategoryId).exec();

        if (!productCategory) {
            throw createHttpError(404, "Product category not found");
        }

        if (!productCategory.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product category");
        }

        productCategory.category = newCategory;

        const updatedProductCategory = await productCategory.save();
        res.status(200).json(updatedProductCategory);
    } catch (error) {
        next(error);
    }
}