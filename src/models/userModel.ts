import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },

    // Role field
    // role: {
    //   type: String,
    //   enum: ["artist", "director"],
    //   required: true,
    // },

    // // artist profile Schema :
    // artistProfile: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ArtistInfo", 
    // },

    // directorProfile if needed
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
