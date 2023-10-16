import { InferSchemaType, Schema, model } from "mongoose";

const productPackageTypeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    packageType: { type: String, required: true },
}, { timestamps: true });

type ProductPackageType = InferSchemaType<typeof productPackageTypeSchema>;

export default model<ProductPackageType>("ProductPackageType", productPackageTypeSchema);