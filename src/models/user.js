const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    mobile: { type: String, trim: true }, // Added mobile (optional)
    countryCode: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
