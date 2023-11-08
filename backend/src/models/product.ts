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
    packageTypeId: { type: Schema.Types.ObjectId, ref: 'ProductPackageType' },
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
