import { InferSchemaType, Schema, model } from "mongoose";

const productImageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    fileName: {
        type: String,
        required: true,
      },
      imageBuffer: {
        type: Buffer,
        required: true,
      },
      // Additional fields like contentType can also be included, if necessary
      contentType: {
        type: String,
        required: true,
      },
}, { timestamps: true }
);

type ProductImage = InferSchemaType<typeof productImageSchema>;
export default model<ProductImage>("ProductImage", productImageSchema);