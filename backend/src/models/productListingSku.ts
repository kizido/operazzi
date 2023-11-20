import { Schema } from "mongoose";

export const productListingSkuSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  channel: { type: String, required: true },
  listingSku: { type: String, required: true },
  pushInventory: { type: Boolean, required: true },
  latency: { type: String, required: true },
  status: { type: Boolean, required: true },
});

export interface IProductListingSku extends Document {
  channel: string;
  listingSku: string;
  pushInventory: boolean;
  latency: string;
  status: boolean;
}

//   export const ListingSkuModel = model<IProductListingSku>('ListingSku', productListingSkuSchema);
