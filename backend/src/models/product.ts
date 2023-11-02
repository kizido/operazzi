import { InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    productSku: { type: String, required: true },
    brand: { type: String, required: true },
    barcodeUpc: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    cogs: { type: String, required: true },
    dimensions: { type: String, required: true },
    packageType: { type: String, required: true },
    weight: { type: String, required: true }, // in grams
    domesticShippingCosts: { type: String },
    internationalShippingCosts: { type: String },
    dutiesAndTariffs: { type: String },
    pickAndPackFee: { type: String },
    amazonReferralFee: { type: String },
    opex: { type: String }, // operating expenditures
    productImageId: { type: Schema.Types.ObjectId, ref: 'ProductImage' }, // Reference to the ProductImage
    activated: { type: Boolean }
}, { timestamps: true });

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);
