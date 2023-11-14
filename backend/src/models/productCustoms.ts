import { InferSchemaType, Schema, model } from "mongoose";

const productCustomsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    customsDeclaration: { type: Boolean },
    itemDescription: { type: String },
    harmonizationCode: { type: String },
    countryOrigin: { type: String },
    declaredValue: { type: Number },
})

type ProductCustoms = InferSchemaType<typeof productCustomsSchema>;
export default model<ProductCustoms>("ProductCustoms", productCustomsSchema);

