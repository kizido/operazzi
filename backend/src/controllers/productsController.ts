import { RequestHandler } from "express";
import ProductModel, {
  IProductListingSku,
  IProductPackaging,
  IProductVendorProduct,
} from "../models/product";
import createHttpError from "http-errors";
import mongoose, { Types, isValidObjectId } from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import ProductCustomsModel from "../models/productCustoms";

export const getProducts: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    const products = await ProductModel.find({
      userId: authenticatedUserId,
    }).exec();
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
};

interface CreateProductBody {
  name?: string;
  manufacturerSku?: string;
  productSku?: string;
  brand?: string;
  barcodeUpc?: string;
  category?: string;
  description?: string;
  dimensions?: {
    productLength?: number;
    productWidth?: number;
    productHeight?: number;
    productDiameter?: number;
  };
  masterCaseDimensions?: {
    masterCaseLength?: number;
    masterCaseWidth?: number;
    masterCaseHeight?: number;
    masterCaseQuantity?: number;
  };
  masterCaseWeight?: number;
  cogs?: string;
  packageTypeId?: Types.ObjectId;
  weight?: string;
  domesticShippingCosts?: string;
  internationalShippingCosts?: string;
  dutiesAndTariffs?: string;
  pickAndPackFee?: string;
  amazonReferralFee?: string;
  amazonStorageFee?: string;
  productImageId?: Types.ObjectId | null;
  productCustomsId?: Types.ObjectId;
  productCustomsInfo?: {
    customsDeclaration?: boolean;
    itemDescription?: string;
    harmonizationCode?: string;
    countryOrigin?: string;
    declaredValue?: string;
  };
  productListingSkus?: IProductListingSku[];
  productVendorProducts?: IProductVendorProduct[];
  vendorProductCogsDefaultRow?: string | null;
  productPackaging?: IProductPackaging[];
  opex?: string;
  ppcSpend?: string;
  growth?: string;
  netProfitTarget?: string;
  activated?: boolean;
}

export const createProduct: RequestHandler<
  unknown,
  unknown,
  CreateProductBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const productSku = req.body.productSku;
  const brand = req.body.brand;
  const barcodeUpc = req.body.barcodeUpc;
  const category = req.body.category;
  const description = req.body.description;
  const cogs = req.body.cogs;
  const dimensions = req.body.dimensions;
  const masterCaseDimensions = req.body.masterCaseDimensions;
  const masterCaseWeight = req.body.masterCaseWeight;
  const packageTypeId = req.body.packageTypeId;
  const weight = req.body.weight;
  const domesticShippingCosts = req.body.domesticShippingCosts;
  const internationalShippingCosts = req.body.internationalShippingCosts;
  const dutiesAndTariffs = req.body.dutiesAndTariffs;
  const pickAndPackFee = req.body.pickAndPackFee;
  const amazonReferralFee = req.body.amazonReferralFee;
  const amazonStorageFee = req.body.amazonStorageFee;
  const activated = req.body.activated;
  const productImageId = req.body.productImageId;
  const productCustomsInfo = req.body.productCustomsInfo;
  const productListingSkus = req.body.productListingSkus ?? null;
  const productVendorProducts = req.body.productVendorProducts ?? null;
  const vendorProductCogsDefaultRow = req.body.vendorProductCogsDefaultRow;
  const productPackaging = req.body.productPackaging ?? null;
  const opex = req.body.opex;
  const ppcSpend = req.body.ppcSpend;
  const growth = req.body.growth;
  const netProfitTarget = req.body.netProfitTarget;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!name) {
      throw createHttpError(400, "Product must have a name!");
    }
    if (!isValidObjectId(productImageId) && productImageId != null) {
      throw createHttpError(400, "Product image id not valid!");
    }
    if (!isValidObjectId(packageTypeId) && packageTypeId != null) {
      throw createHttpError(400, "Package type id not valid!");
    }

    const productCustoms = await ProductCustomsModel.create({
      userId: authenticatedUserId,
      customsDeclaration: productCustomsInfo?.customsDeclaration || false,
      itemDescription: productCustomsInfo?.itemDescription || "",
      harmonizationCode: productCustomsInfo?.harmonizationCode || "",
      countryOrigin: productCustomsInfo?.countryOrigin || "",
      declaredValue: productCustomsInfo?.declaredValue || "",
    });

    if (!isValidObjectId(productCustoms._id)) {
      throw createHttpError(400, "Invalid product customs ID");
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
      dimensions: dimensions,
      masterCaseDimensions: masterCaseDimensions,
      masterCaseWeight: masterCaseWeight,
      packageTypeId: packageTypeId,
      weight: weight,
      domesticShippingCosts: domesticShippingCosts,
      internationalShippingCosts: internationalShippingCosts,
      dutiesAndTariffs: dutiesAndTariffs,
      pickAndPackFee: pickAndPackFee,
      amazonReferralFee: amazonReferralFee,
      amazonStorageFee: amazonStorageFee,
      opex,
      ppcSpend,
      growth,
      netProfitTarget,
      productImageId: productImageId,
      productCustomsId: productCustoms._id,
      productListingSkus: productListingSkus,
      productVendorProducts: productVendorProducts,
      vendorProductCogsDefaultRow: vendorProductCogsDefaultRow,
      productPackaging: productPackaging,
      activated: activated,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

interface UpdateProductParams {
  productId: string;
}
interface UpdateProductBody {
  name?: string;
  manufacturerSku?: string;
  productSku?: string;
  brand?: string;
  barcodeUpc?: string;
  category?: string;
  description?: string;
  cogs?: string;
  dimensions?: {
    productLength?: number;
    productWidth?: number;
    productHeight?: number;
    productDiameter?: number;
  };
  masterCaseDimensions?: {
    masterCaseLength?: number;
    masterCaseWidth?: number;
    masterCaseHeight?: number;
    masterCaseQuantity?: number;
  };
  masterCaseWeight?: number;
  packageTypeId?: Types.ObjectId;
  weight?: string;
  domesticShippingCosts?: string;
  internationalShippingCosts?: string;
  dutiesAndTariffs?: string;
  pickAndPackFee?: string;
  amazonReferralFee?: string;
  amazonStorageFee?: string;
  productImageId?: Types.ObjectId;
  productListingSkus?: IProductListingSku[];
  productVendorProducts?: IProductVendorProduct[];
  vendorProductCogsDefaultRow?: string | null;
  productPackaging?: IProductPackaging[];
  opex?: string;
  ppcSpend?: string;
  growth?: string;
  netProfitTarget?: string;
  activated?: boolean;
}

export const updateProduct: RequestHandler<
  UpdateProductParams,
  unknown,
  UpdateProductBody,
  unknown
> = async (req, res, next) => {
  const productId = req.params.productId;
  const newName = req.body.name;
  const newProductSku = req.body.productSku;
  const newBrand = req.body.brand;
  const newBarcodeUpc = req.body.barcodeUpc;
  const newCategory = req.body.category;
  const newDescription = req.body.description;
  const newCogs = req.body.cogs;
  const newDimensions = req.body.dimensions;
  const newMasterCaseDimensions = req.body.masterCaseDimensions;
  const newMasterCaseWeight = req.body.masterCaseWeight;
  const newPackageTypeId = req.body.packageTypeId;
  const newWeight = req.body.weight;
  const newDomesticShippingCosts = req.body.domesticShippingCosts;
  const newInternationalShippingCosts = req.body.internationalShippingCosts;
  const newDutiesAndTariffs = req.body.dutiesAndTariffs;
  const newPickAndPackFee = req.body.pickAndPackFee;
  const newAmazonReferralFee = req.body.amazonReferralFee;
  const newAmazonStorageFee = req.body.amazonStorageFee;
  const newProductImageId = req.body.productImageId;
  const newProductListingSkus = req.body.productListingSkus ?? null;
  const newProductVendorProducts = req.body.productVendorProducts ?? null;
  const newVendorProductCogsDefaultRow = req.body.vendorProductCogsDefaultRow;
  const newProductPackaging = req.body.productPackaging ?? null;
  const newOpex = req.body.opex;
  const newPpcSpend = req.body.ppcSpend;
  const newGrowth = req.body.growth;
  const newNetProfitTarget = req.body.netProfitTarget;
  const newActivated = req.body.activated;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(productId)) {
      throw createHttpError(400, "Invalid product ID");
    }
    if (!isValidObjectId(newProductImageId) && newProductImageId != null) {
      throw createHttpError(400, "Product image id not valid!");
    }
    if (!isValidObjectId(newPackageTypeId) && newPackageTypeId != null) {
      throw createHttpError(400, "Package type id not valid!");
    }

    // Validate product body
    if (!newName) {
      throw createHttpError(400, "Product must have a name!");
    }
    if (!newProductSku) {
      throw createHttpError(400, "Product must have a sku!");
    }
    if (!newBrand) {
      throw createHttpError(400, "Product must have a brand!");
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
    product.dimensions = {
      productLength: newDimensions!.productLength,
      productWidth: newDimensions!.productWidth,
      productHeight: newDimensions!.productHeight,
      productDiameter: newDimensions!.productDiameter,
    };
    product.masterCaseDimensions = {
      masterCaseLength: newMasterCaseDimensions!.masterCaseLength,
      masterCaseWidth: newMasterCaseDimensions!.masterCaseWidth,
      masterCaseHeight: newMasterCaseDimensions!.masterCaseHeight,
      masterCaseQuantity: newMasterCaseDimensions!.masterCaseQuantity,
    };
    product.masterCaseWeight = newMasterCaseWeight;
    product.packageTypeId = newPackageTypeId;
    product.weight = newWeight;
    product.domesticShippingCosts = newDomesticShippingCosts;
    product.internationalShippingCosts = newInternationalShippingCosts;
    product.dutiesAndTariffs = newDutiesAndTariffs;
    product.pickAndPackFee = newPickAndPackFee;
    product.amazonReferralFee = newAmazonReferralFee;
    product.amazonStorageFee = newAmazonStorageFee;
    product.opex = newOpex;
    product.ppcSpend = newPpcSpend;
    product.growth = newGrowth;
    product.netProfitTarget = newNetProfitTarget;
    product.productImageId = newProductImageId;
    product.activated = newActivated;
    product.vendorProductCogsDefaultRow =
      newVendorProductCogsDefaultRow ?? undefined;

    if (newProductListingSkus) {
      // Clear the existing DocumentArray
      product.productListingSkus.splice(0, product.productListingSkus.length);

      // Add the new items
      newProductListingSkus.forEach((sku) =>
        product.productListingSkus.push(sku)
      );
    }

    if (newProductVendorProducts) {
      product.productVendorProducts.splice(
        0,
        product.productVendorProducts.length
      );

      newProductVendorProducts.forEach((vProduct) =>
        product.productVendorProducts.push(vProduct)
      );
    }
    if (newProductPackaging) {
      // Clear the existing DocumentArray
      product.productPackaging.splice(0, product.productPackaging.length);

      // Add the new items
      newProductPackaging.forEach((sku) => product.productPackaging.push(sku));
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const toggleActivateProduct: RequestHandler<
  UpdateProductParams,
  unknown,
  UpdateProductBody,
  unknown
> = async (req, res, next) => {
  const productId = req.params.productId;

  const newActivated = !req.body.activated;

  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(productId)) {
      throw createHttpError(400, "Invalid product ID");
    }

    const product = await ProductModel.findById(productId).exec();

    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    if (!product.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this product");
    }

    product.activated = newActivated;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

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

    const productCustoms = await ProductCustomsModel.findById(
      product.productCustomsId
    ).exec();

    if (!productCustoms) {
      // throw createHttpError(404, "Product customs not found!");
    } else {
      await productCustoms.deleteOne();
    }
    await product.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
