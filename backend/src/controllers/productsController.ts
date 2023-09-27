import { RequestHandler } from "express";
import ProductModel from "../models/product";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getProducts: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const products = await ProductModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProduct: RequestHandler = async (req, res, next) => {
    const productId = req.params.productId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Invalid product ID");
        }

        const product = await ProductModel.findById(productId).exec();

        if (!product) {
            throw createHttpError(404, "Product not found!");
        }

        if (!product.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product");
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

interface CreateProductBody {
    name?: string;
    manufacturerSku?: string;
    productSku?: string;
    brand?: string;
    barcodeUpc?: string;
    category?: string;
    description?: string;
    cogs?: string;
    packagingCosts?: string;
    weight?: string;
    domesticShippingCosts?: string;
    internationalShippingCosts?: string;
    dutiesAndTariffs?: string;
    pickAndPackFee?: string;
    amazonReferralFee?: string;
    opex?: string;
}

export const createProduct: RequestHandler<unknown, unknown, CreateProductBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const productSku = req.body.productSku;
    const brand = req.body.brand;
    const barcodeUpc = req.body.barcodeUpc;
    const category = req.body.category;
    const description = req.body.description;
    const cogs = req.body.cogs;
    const packagingCosts = req.body.packagingCosts;
    const weight = req.body.weight;
    const domesticShippingCosts = req.body.domesticShippingCosts;
    const internationalShippingCosts = req.body.internationalShippingCosts;
    const dutiesAndTariffs = req.body.dutiesAndTariffs;
    const pickAndPackFee = req.body.pickAndPackFee;
    const amazonReferralFee = req.body.amazonReferralFee;
    const opex = req.body.opex;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!name) {
            throw createHttpError(400, "Product must have a name!");
        }

        const newProduct = await ProductModel.create({
            userId: authenticatedUserId,
            name: name,
            productSku: productSku,
            brand: brand,
            barcodeUpc: barcodeUpc,
            category: category,
            description: description,
            cogs: cogs,
            packagingCosts: packagingCosts,
            weight: weight,
            domesticShippingCosts: domesticShippingCosts,
            internationalShippingCosts: internationalShippingCosts,
            dutiesAndTariffs: dutiesAndTariffs,
            pickAndPackFee: pickAndPackFee,
            amazonReferralFee: amazonReferralFee,
            opex: opex,
        });

        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

interface UpdateProductParams {
    productId: string,
}
interface UpdateProductBody {
    name?: string,
    manufacturerSku?: string,
    productSku?: string,
    brand?: string,
    barcodeUpc?: string,
    category?: string,
    description?: string,
    cogs?: string,
    packagingCosts?: string,
    weight?: string,
    domesticShippingCosts?: string,
    internationalShippingCosts?: string,
    dutiesAndTariffs?: string,
    pickAndPackFee?: string,
    amazonReferralFee?: string,
    opex?: string,
}

export const updateProduct: RequestHandler<UpdateProductParams, unknown, UpdateProductBody, unknown> = async (req, res, next) => {
    const productId = req.params.productId;
    const newName = req.body.name;
    const newProductSku = req.body.productSku;
    const newBrand = req.body.brand;
    const newBarcodeUpc = req.body.barcodeUpc;
    const newCategory = req.body.category;
    const newDescription = req.body.description;
    const newCogs = req.body.cogs;
    const newPackagingCosts = req.body.packagingCosts;
    const newWeight = req.body.weight;
    const newDomesticShippingCosts = req.body.domesticShippingCosts;
    const newInternationalShippingCosts = req.body.internationalShippingCosts;
    const newDutiesAndTariffs = req.body.dutiesAndTariffs;
    const newPickAndPackFee = req.body.pickAndPackFee;
    const newAmazonReferralFee = req.body.amazonReferralFee;
    const newOpex = req.body.opex;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Invalid product ID");
        }
        // Validate product body
        if (!newName || !newProductSku || !newBrand || !newBarcodeUpc || !newCategory
            || !newDescription || !newCogs || !newPackagingCosts || !newWeight
            || !newDomesticShippingCosts || !newInternationalShippingCosts || !newDutiesAndTariffs
            || !newPickAndPackFee || !newAmazonReferralFee || !newAmazonReferralFee || !newOpex) {
            throw createHttpError(400, "Product must have all  required attributes!");
        }


        const product = await ProductModel.findById(productId).exec();

        if (!product) {
            throw createHttpError(404, "Product not found");
        }

        if (!product.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product");
        }

        product.name = newName;
        product.productSku = newProductSku;
        product.brand = newBrand;
        product.barcodeUpc = newBarcodeUpc;
        product.category = newCategory;
        product.description = newDescription;
        product.cogs = newCogs;
        product.packagingCosts = newPackagingCosts;
        product.weight = newWeight;
        product.domesticShippingCosts = newDomesticShippingCosts;
        product.internationalShippingCosts = newInternationalShippingCosts;
        product.dutiesAndTariffs = newDutiesAndTariffs;
        product.pickAndPackFee = newPickAndPackFee;
        product.amazonReferralFee = newAmazonReferralFee;
        product.opex = newOpex;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
    const productId = req.params.productId;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Invalid product id");
        }
        const product = await ProductModel.findById(productId).exec();

        if (!product) {
            throw createHttpError(404, "Product not found");
        }

        if (!product.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this product");
        }

        await product.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}