import { InferSchemaType, Schema, model } from "mongoose";

const productCategorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    category: { type: String, required: true },
}, { timestamps: true });

type ProductCategory = InferSchemaType<typeof productCategorySchema>;

export default model<ProductCategory>("ProductCategory", productCategorySchema);