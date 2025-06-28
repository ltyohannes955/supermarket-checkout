import { Schema, model } from "mongoose";

export interface IUserSchema {
  name: string;
  email: string;
  DateOfBirth: Date;
  password: string;
  role: string;
}

const UserSchema = new Schema<IUserSchema>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    DateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

// Add a pre-save hook to hash passwords
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const bcrypt = require("bcryptjs");
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default model("User", UserSchema);
