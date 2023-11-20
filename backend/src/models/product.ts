import { InferSchemaType, Schema, model } from "mongoose";
import { IProductListingSku, productListingSkuSchema } from "./productListingSku";

interface IDimensions {
    productLength: number;
    productWidth: number;
    productHeight: number;
    productDiameter?: number;
  }
  
  interface IMasterCaseDimensions {
    masterCaseLength: number;
    masterCaseWidth: number;
    masterCaseHeight: number;
    masterCaseQuantity?: number;
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
    activated: { type: Boolean },
  },
  { timestamps: true }
);

interface IProduct extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  productSku: string;
  brand: string;
  barcodeUpc: string;
  category?: string;
  description?: string;
  cogs: string;
  dimensions: IDimensions;
  masterCaseDimensions: IMasterCaseDimensions;
  masterCaseWeight: number;
  packageTypeId?: Schema.Types.ObjectId; // Can be null, so it's optional
  weight: string; // Assuming weight is stored as a string, e.g., "200g"
  domesticShippingCosts?: string;
  internationalShippingCosts?: string;
  dutiesAndTariffs?: string;
  pickAndPackFee?: string;
  amazonReferralFee?: string;
  opex?: string; // operating expenditures
  productImageId?: Schema.Types.ObjectId; // Can be null, so it's optional
  productCustomsId: Schema.Types.ObjectId;
  productListingSkus: IProductListingSku[];
  activated: boolean;
  createdAt?: Date; // Comes from timestamps: true
  updatedAt?: Date; // Comes from timestamps: true
}

export const ProductModel = model<IProduct>('Product', productSchema);
