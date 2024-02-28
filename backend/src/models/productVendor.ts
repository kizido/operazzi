import { InferSchemaType, Schema, model } from "mongoose";

const productVendorSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    vendor: { type: String, required: true },
}, { timestamps: true });

type ProductVendor = InferSchemaType<typeof productVendorSchema>;

export default model<ProductVendor>("ProductVendor", productVendorSchema);