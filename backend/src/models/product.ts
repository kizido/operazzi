import { InferSchemaType, Schema, model } from "mongoose";

const productListingSkuSchema = new Schema({
  channel: { type: String, required: true },
  listingSku: { type: String, required: true },
  pushInventory: { type: Boolean, required: true },
  latency: { type: String, required: true },
  status: { type: Boolean, required: true },
});
const vendorRangePriceSchema = new Schema({
  minUnits: { type: String, required: true },
  maxUnits: { type: String, required: true },
  price: { type: String, required: true }
});
const productVendorProductSchema = new Schema({
  vendor: { type: String, required: true },
  vendorSku: { type: String, required: true },
  perUnitCogs: { type: String, required: true },
  minOrderQuantity: { type: String, required: true },
  leadTime: { type: String, required: true },
  vendorRangePrice: [vendorRangePriceSchema],
})
const productPackagingSchema = new Schema({
  itemName: { type: String, required: true },
  perUnitCost: { type: String, required: true },
})

export interface IProductListingSku {
  channel: string,
  listingSku: string,
  pushInventory: boolean,
  latency: string,
  status: boolean,
}

export interface IProductVendorProduct {
  vendor: string,
  vendorSku: string,
  perUnitCogs: string,
  minOrderQuantity: string,
  leadTime: string,
  vendorRangePrice: {
    minUnits: string,
    maxUnits: string,
    price: string,
  }[],
}

export interface IProductPackaging {
  itemName: string,
  perUnitCost: string,
}

const productSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    productSku: { type: String, required: true },
    brand: { type: String, required: true },
    barcodeUpc: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    cogs: { type: String, required: true },
    dimensions: {
      productLength: { type: Number, required: true },
      productWidth: { type: Number, required: true },
      productHeight: { type: Number, required: true },
      productDiameter: { type: Number },
    },
    masterCaseDimensions: {
      masterCaseLength: { type: Number, required: true },
      masterCaseWidth: { type: Number, required: true },
      masterCaseHeight: { type: Number, required: true },
      masterCaseQuantity: { type: Number },
    },
    masterCaseWeight: { type: Number, required: true },
    packageTypeId: {
      type: Schema.Types.ObjectId || null,
      ref: "ProductPackageType",
    },
    weight: { type: String, required: true }, // in grams
    domesticShippingCosts: { type: String },
    internationalShippingCosts: { type: String },
    dutiesAndTariffs: { type: String },
    pickAndPackFee: { type: String },
    amazonReferralFee: { type: String },
    opex: { type: String }, // operating expenditures
    productImageId: {
      type: Schema.Types.ObjectId || null,
      ref: "ProductImage",
    }, // Reference to the ProductImage
    productCustomsId: { type: Schema.Types.ObjectId, ref: "ProductCustoms" },
    productListingSkus: [productListingSkuSchema],
    productVendorProducts: [productVendorProductSchema],
    vendorProductCogsDefaultRow: { type: String },
    productPackaging: [productPackagingSchema],
    activated: { type: Boolean },
  },
  { timestamps: true }
);

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);
