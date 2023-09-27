import { InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    productSku: { type: String, required: true},
    brand: { type: String, required: true},
    barcodeUpc: {type: String, required: true},
    category: { type: String, required: true },
    description: { type: String, required: true },
    cogs: { type: String, required: true },
    packagingCosts: { type: String, required: true },
    weight: { type: String, required: true }, // in grams
    domesticShippingCosts: {type: String, required: true},
    internationalShippingCosts: {type: String, required: true},
    dutiesAndTariffs: {type: String, required: true},
    pickAndPackFee: {type: String, required: true},
    amazonReferralFee: {type: String, required: true},
    opex: {type: String, required: true}, // operating expendatures
}, { timestamps: true });

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);