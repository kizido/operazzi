import { InferSchemaType, Schema, model } from "mongoose";

const productPackageTypeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    packageName: { type: String, required: true },
    packageLength: { type: Number, required: true },
    packageWidth: { type: Number, required: true },
    packageHeight: { type: Number, required: true },
    packageWeight: { type: Number, required: true },
}, { timestamps: true });

type ProductPackageType = InferSchemaType<typeof productPackageTypeSchema>;

export default model<ProductPackageType>("ProductPackageType", productPackageTypeSchema);