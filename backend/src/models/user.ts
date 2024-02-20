import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, required: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
