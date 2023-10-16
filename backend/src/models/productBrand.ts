import { InferSchemaType, Schema, model } from "mongoose";

const productBrandSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    brand: { type: String, required: true },
}, { timestamps: true });

type ProductBrand = InferSchemaType<typeof productBrandSchema>;

export default model<ProductBrand>("ProductBrand", productBrandSchema);